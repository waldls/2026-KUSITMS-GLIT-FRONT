import { basename } from "node:path";

import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

import { loadEnvFile } from "./load-env";

loadEnvFile();

type TestStatus = "passed" | "failed" | "skipped" | "flaky";

type TestRecord = {
  title: string;
  suiteTitle: string;
  specFile: string;
  domain: string;
  project: string;
  durationMs: number;
  status: TestStatus;
  errorMessage?: string;
};

/** `src/__tests__/e2e/{domain}/` 폴더명 → Discord 표시명. 새 E2E 도메인 추가 시 여기에 한 줄 추가 */
const E2E_DOMAIN_LABELS: Record<string, string> = {
  record: "기록하기",
  report: "리포트",
  calendar: "캘린더",
  auth: "인증",
  home: "홈",
  my: "마이",
  onboarding: "온보딩",
};

const DISCORD_DESCRIPTION_LIMIT = 4096;
const MAX_FAILURE_DETAILS = 5;
const MAX_ERROR_CHARS = 600;

function formatKst(date: Date) {
  return date
    .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
    .replace("T", " ")
    .concat(" (KST)");
}

function formatDuration(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function sanitizeError(message: string) {
  return truncate(
    message
      .replace(/\u001b\[[0-9;]*m/g, "")
      .replace(/```/g, "'''")
      .trim(),
    MAX_ERROR_CHARS,
  );
}

function getSpecFile(test: TestCase) {
  return test.location?.file ? basename(test.location.file) : "unknown.spec.ts";
}

function getE2eDomain(test: TestCase) {
  const file = test.location?.file;
  if (!file) return "unknown";

  const match = file.replace(/\\/g, "/").match(/\/e2e\/([^/]+)\//);
  return match?.[1] ?? "unknown";
}

function buildScenarioLabel(records: TestRecord[]) {
  const domains = [
    ...new Set(
      records
        .filter(record => record.status !== "skipped")
        .map(record => record.domain)
        .filter(domain => domain !== "unknown"),
    ),
  ].sort();

  if (domains.length === 0) return "E2E";

  return domains.map(domain => E2E_DOMAIN_LABELS[domain] ?? domain).join(", ");
}

function buildReportContext() {
  const explicit = process.env.DISCORD_REPORT_CONTEXT?.trim();
  if (explicit) return explicit;

  const ref = process.env.GITHUB_REF ?? "";
  const prMatch = ref.match(/^refs\/pull\/(\d+)\/merge$/);
  if (prMatch) return `PR #${prMatch[1]}`;

  const headRef = process.env.GITHUB_HEAD_REF?.trim();
  if (headRef && process.env.CI) return headRef;

  return "";
}

function resolveScenarioDisplay(records: TestRecord[]) {
  const override = process.env.DISCORD_REPORT_SCENARIO?.trim();
  if (override) return override;

  const label = buildScenarioLabel(records);
  const context = buildReportContext();

  return context ? `${label} · ${context}` : label;
}

function getSuiteTitle(test: TestCase) {
  const titles = test.titlePath().filter(Boolean);
  if (titles.length < 2) return "E2E";
  return titles[titles.length - 2] ?? "E2E";
}

function getTestTitle(test: TestCase) {
  const titles = test.titlePath().filter(Boolean);
  return titles[titles.length - 1] ?? test.title;
}

function resolveTestStatus(test: TestCase, result: TestResult): TestStatus | null {
  if (result.status === "skipped") return "skipped";
  if (result.status === "passed") return result.retry > 0 ? "flaky" : "passed";
  if (
    result.status === "failed" ||
    result.status === "timedOut" ||
    result.status === "interrupted"
  ) {
    return "failed";
  }
  return null;
}

function groupTestsBySuite(records: TestRecord[]) {
  const groups = new Map<string, TestRecord[]>();

  for (const record of records) {
    const key = `${record.specFile}::${record.suiteTitle}`;
    const bucket = groups.get(key) ?? [];
    bucket.push(record);
    groups.set(key, bucket);
  }

  return [...groups.entries()].map(([key, tests]) => {
    const [specFile, suiteTitle] = key.split("::");
    return { specFile, suiteTitle, tests };
  });
}

function countByProject(records: TestRecord[]) {
  const counts = new Map<string, number>();
  for (const record of records) {
    if (record.status === "skipped") continue;
    counts.set(record.project, (counts.get(record.project) ?? 0) + 1);
  }
  return counts;
}

function buildBrowserSection(records: TestRecord[]) {
  const counts = countByProject(records);
  if (counts.size === 0) return "🌐 **브라우저별 실행:** (없음)";

  const lines = [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([project, count]) => `${project}: ${count}개`);

  return `🌐 **브라우저별 실행:** ${lines.join(", ")}`;
}

function buildSuiteSection(records: TestRecord[], allPassed: boolean) {
  const executed = records.filter(record => record.status !== "skipped");
  const groups = groupTestsBySuite(executed);
  if (groups.length === 0) return "📋 **스위트별 결과:** (없음)";

  const lines: string[] = ["📋 **스위트별 결과:**"];

  for (const group of groups) {
    const passed = group.tests.filter(test => test.status === "passed" || test.status === "flaky");
    const failed = group.tests.filter(test => test.status === "failed");
    const suiteDurationMs = group.tests.reduce((sum, test) => sum + test.durationMs, 0);
    const headlineCount = allPassed
      ? `${passed.length}개 통과`
      : `${passed.length}개 통과, ${failed.length}개 실패`;

    lines.push(
      "",
      `\`${group.specFile}\` > **${group.suiteTitle}** — ${headlineCount}, ${formatDuration(suiteDurationMs)}`,
    );

    const listed = allPassed ? passed : [...passed, ...failed];
    for (const test of listed.slice(0, 12)) {
      const icon = test.status === "failed" ? "✗" : "✓";
      lines.push(`${icon} ${test.title} — ${formatDuration(test.durationMs)}`);
    }

    if (listed.length > 12) {
      lines.push(`…외 ${listed.length - 12}건`);
    }
  }

  return lines.join("\n");
}

function buildFailureSection(failedTests: TestRecord[]) {
  if (failedTests.length === 0) return "";

  const lines: string[] = ["", "🚨 **상세 이슈 리포트**"];

  failedTests.slice(0, MAX_FAILURE_DETAILS).forEach((test, index) => {
    lines.push(
      "",
      `**${index + 1}. ✗ ${test.title}**`,
      `환경: \`${test.project}\` | 소요시간: ${formatDuration(test.durationMs)}`,
    );

    if (test.errorMessage) {
      lines.push("```", sanitizeError(test.errorMessage), "```");
    }
  });

  if (failedTests.length > MAX_FAILURE_DETAILS) {
    lines.push("", `…외 ${failedTests.length - MAX_FAILURE_DETAILS}건의 실패`);
  }

  return lines.join("\n");
}

class DiscordReporter implements Reporter {
  private records: TestRecord[] = [];
  private startedAt = Date.now();

  onBegin() {
    this.startedAt = Date.now();
    this.records = [];
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = resolveTestStatus(test, result);
    if (!status) return;

    this.records.push({
      title: getTestTitle(test),
      suiteTitle: getSuiteTitle(test),
      specFile: getSpecFile(test),
      domain: getE2eDomain(test),
      project: test.parent.project()?.name ?? "unknown",
      durationMs: result.duration,
      status,
      errorMessage: result.error?.message ?? result.error?.stack,
    });
  }

  async onEnd(result: FullResult) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
    if (!webhookUrl) {
      console.info("[discord-reporter] DISCORD_WEBHOOK_URL이 없어 알림을 건너뜁니다.");
      return;
    }

    const executed = this.records.filter(record => record.status !== "skipped");
    const passed = executed.filter(
      record => record.status === "passed" || record.status === "flaky",
    );
    const failed = executed.filter(record => record.status === "failed");
    const skipped = this.records.filter(record => record.status === "skipped");
    const total = executed.length;
    const allPassed = result.status === "passed" && failed.length === 0;
    const successRate = total > 0 ? ((passed.length / total) * 100).toFixed(1) : "0.0";
    const durationSec = formatDuration(result.duration);
    const scenario = resolveScenarioDisplay(this.records);
    const executedAt = formatKst(new Date(this.startedAt));

    const title = allPassed
      ? "✅ E2E 테스트 요약 보고서 (전체 통과)"
      : "🚨 E2E 테스트 요약 보고서 (실패 발생)";

    const testResultText = allPassed
      ? `총 ${total}개 전체 통과`
      : `총 ${total}개 중 ${failed.length}개 실패`;

    const summaryFields = [
      { name: "상태", value: allPassed ? "**PASSED**" : "**FAILED**", inline: true },
      { name: "실행 일시", value: executedAt, inline: true },
      { name: "테스트 결과", value: testResultText, inline: true },
      { name: "총 소요시간", value: durationSec, inline: true },
      { name: "실행 시나리오", value: scenario, inline: true },
    ];

    if (!allPassed) {
      summaryFields.push({
        name: "성공률",
        value: `${successRate}%`,
        inline: true,
      });
    }

    if (skipped.length > 0) {
      summaryFields.push({
        name: "스킵",
        value: `${skipped.length}개`,
        inline: true,
      });
    }

    const description = truncate(
      [
        buildBrowserSection(executed),
        "",
        buildSuiteSection(executed, allPassed),
        buildFailureSection(failed),
      ].join("\n"),
      DISCORD_DESCRIPTION_LIMIT,
    );

    const reportUrl = process.env.DISCORD_REPORT_URL?.trim();
    const avatarUrl = process.env.DISCORD_WEBHOOK_AVATAR_URL?.trim();

    const payload: Record<string, unknown> = {
      username: process.env.DISCORD_WEBHOOK_USERNAME ?? "QA 봇",
      embeds: [
        {
          title,
          color: allPassed ? 0x22c55e : 0xef4444,
          fields: summaryFields,
          description,
          timestamp: new Date().toISOString(),
          footer: {
            text: process.env.DISCORD_REPORT_FOOTER ?? "2026-KUSITMS-GLIT-FRONT · Playwright",
          },
        },
      ],
    };

    if (avatarUrl) {
      payload.avatar_url = avatarUrl;
    }

    if (reportUrl) {
      payload.components = [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: "📊 대시보드에서 상세 보기",
              url: reportUrl,
            },
          ],
        },
      ];
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.text();
        console.warn(
          `[discord-reporter] Discord 전송 실패 (${response.status}): ${body.slice(0, 200)}`,
        );
      }
    } catch (error) {
      console.warn("[discord-reporter] Discord 전송 중 오류:", error);
    }
  }
}

export default DiscordReporter;
