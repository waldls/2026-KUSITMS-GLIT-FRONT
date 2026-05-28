"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CTA from "@/components/common/CTA";
import Modal from "@/components/common/Modal";
import Tag from "@/components/common/Tag";
import GlowingSkillStone, { type SkillStoneId } from "@/components/record/stones/GlowingSkillStone";
import { PRIMARY_CATEGORY_MAP } from "@/constants/competency";
import {
  type AiTaggingResultResponse,
  type Competency,
  getHomeSummary,
  type ReportModalType,
} from "@/lib/apis/record/record";
import { clearRecordSession, markRecordFlowCompleted } from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";

const finalizeRecordFlow = () => {
  useRecordDraftStore.getState().reset();
  clearRecordSession();
  markRecordFlowCompleted();
};

const CATEGORY_STONE_ID: Record<Competency, SkillStoneId> = {
  DISCOVERY_ANALYSIS: 1,
  PLANNING_EXECUTION: 2,
  COLLABORATION: 3,
  PROBLEM_SOLVING: 4,
  REFLECTION_GROWTH: 5,
};

function getPrimaryCategoryLabels(results: AiTaggingResultResponse[]) {
  return Array.from(
    new Set(
      results.flatMap(result =>
        result.primaryCategory
          ? [PRIMARY_CATEGORY_MAP[result.primaryCategory]?.label ?? result.primaryCategory]
          : [],
      ),
    ),
  );
}

function getDetailTagLabels(results: AiTaggingResultResponse[]) {
  return Array.from(new Set(results.flatMap(result => result.detailTags ?? [])));
}

function getStoneIds(results: AiTaggingResultResponse[]) {
  return Array.from(
    new Set(
      results.flatMap(result =>
        result.primaryCategory ? [CATEGORY_STONE_ID[result.primaryCategory]] : [],
      ),
    ),
  );
}

function StonePreview({ stoneIds }: { stoneIds: SkillStoneId[] }) {
  return (
    <div className="flex max-w-48 flex-wrap justify-center gap-4.5">
      {stoneIds.map(stoneId => (
        <GlowingSkillStone key={stoneId} skillId={stoneId} animate className="size-17" />
      ))}
    </div>
  );
}

function formatDetailTagLabel(tagLabel: string) {
  const label = tagLabel.startsWith("#") ? tagLabel.slice(1) : tagLabel;

  return `# ${label}`;
}

function SkillTaggingSuccess({ results }: { results: AiTaggingResultResponse[] }) {
  const router = useRouter();
  const primaryCategoryLabels = getPrimaryCategoryLabels(results);
  const detailTagLabels = getDetailTagLabels(results);
  const stoneIds = getStoneIds(results);
  const [reportModalType, setReportModalType] = useState<ReportModalType | null>(null);
  const reportModalTitle =
    reportModalType === "MINI"
      ? "커리어 미니 리포트를 발행해보세요"
      : "커리어 리포트를 발행해보세요";

  useEffect(() => {
    finalizeRecordFlow();
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadHomeSummary = async () => {
      try {
        const summary = await getHomeSummary();

        if (summary?.isFirstStar !== undefined) {
          window.sessionStorage.setItem("isFirstStar", String(summary.isFirstStar));
        }

        if (!ignore && summary?.reportModal?.show && summary.reportModal.type) {
          setReportModalType(summary.reportModal.type);
        }
      } catch {}
    };

    void loadHomeSummary();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="relative -mx-5 flex min-h-0 flex-1 flex-col overflow-hidden px-5">
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
        <StonePreview stoneIds={stoneIds} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mt-3.75 flex flex-col items-center px-8">
            <p className="head-4 text-white">오늘의 경험이</p>
            <h1 className="head-4 text-sea-blue-500 text-center">
              [{primaryCategoryLabels.join("] [")}]
            </h1>
            <p className="head-4 text-white">으로 기록됐어요</p>
          </div>

          <div className="scrollbar-hide mt-3 flex flex-wrap justify-center gap-1 overflow-y-auto px-3">
            {detailTagLabels.map(tagLabel => (
              <Tag key={tagLabel} variant="gray" className="bg-gray-850">
                {formatDetailTagLabel(tagLabel)}
              </Tag>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 shrink-0 pb-10">
        <Link href="/" onClick={finalizeRecordFlow}>
          <CTA>홈으로 돌아가기</CTA>
        </Link>
      </div>

      <Modal
        isOpen={reportModalType !== null}
        type="double"
        title={reportModalTitle}
        contents={
          <>
            지금까지 쌓인 기록으로 만들어진
            <br />
            커리어 {reportModalType === "MINI" ? "미니 " : ""}리포트를 확인해보세요
          </>
        }
        btnLLabel="다음에 보기"
        btnRLabel="리포트 만들기"
        onBtnLClick={() => setReportModalType(null)}
        onBtnRClick={() => router.push("/report")}
        onClose={() => setReportModalType(null)}
        contentClassName="px-7 py-5"
        btnLClassName="px-5"
        btnRClassName="px-5"
      />
    </section>
  );
}

export default SkillTaggingSuccess;
