"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CTA from "@/components/common/CTA";
import Modal from "@/components/common/Modal";
import Tag from "@/components/common/Tag";
import GlowingSkillStone, { type SkillStoneId } from "@/components/record/stones/GlowingSkillStone";
import { PRIMARY_CATEGORY_MAP } from "@/constants/competency";
import { SKILL_STONE_ASSETS } from "@/constants/skillStoneAssets";
import {
  type AiTaggingResultResponse,
  getHomeSummary,
  type ReportModalType,
} from "@/lib/apis/record/record";
import { clearCreatedProjectTagIds } from "@/lib/utils/recordCreatedProjectTags";
import {
  clearRecordSession,
  clearTodayTaskSubmittedDates,
  markRecordFlowCompleted,
} from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";
import type { Competency } from "@/types/competency";

const CATEGORY_STONE_ID: Record<Competency, SkillStoneId> = {
  DISCOVERY_ANALYSIS: 1,
  PLANNING_EXECUTION: 2,
  COLLABORATION: 3,
  PROBLEM_SOLVING: 4,
  REFLECTION_GROWTH: 5,
};

const finalizeRecordFlow = () => {
  useRecordDraftStore.getState().reset();
  clearCreatedProjectTagIds();
  clearRecordSession();
  clearTodayTaskSubmittedDates();
  markRecordFlowCompleted();
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

function formatDetailTagLabel(tagLabel: string) {
  const label = tagLabel.startsWith("#") ? tagLabel.slice(1) : tagLabel;

  return `# ${label}`;
}

function SkillTaggingSuccess({ results }: { results: AiTaggingResultResponse[] }) {
  const router = useRouter();
  const primaryCategoryLabels = getPrimaryCategoryLabels(results);
  const detailTagLabels = getDetailTagLabels(results);
  const stoneIds = getStoneIds(results);
  const hasSingleStone = stoneIds.length === 1;
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
    <section className="relative -mx-5 flex min-h-full flex-col px-5 pb-10">
      <div className="relative flex flex-1 flex-col items-center py-10">
        <div aria-hidden className="flex-1" />
        <div className="flex w-full flex-col items-center">
          <div
            className={
              hasSingleStone
                ? "flex size-27 shrink-0 items-center justify-center"
                : "flex max-w-48 shrink-0 flex-wrap justify-center gap-4.5"
            }>
            {stoneIds.map(stoneId => (
              <GlowingSkillStone
                key={stoneId}
                skillId={stoneId}
                animate
                ariaLabel={SKILL_STONE_ASSETS[stoneId].label}
                className={hasSingleStone ? "size-27" : "size-17"}
              />
            ))}
          </div>
          <div className="mt-3.75 flex w-full max-w-sm flex-col items-center text-center">
            <div className="flex flex-col items-center px-8">
              <p className="head-4 text-white">오늘의 경험이</p>
              <h1 className="head-4 text-sea-blue-500 text-center">
                [{primaryCategoryLabels.join("] [")}]
              </h1>
              <p className="head-4 text-white">으로 기록됐어요</p>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-1 px-3">
              {detailTagLabels.map(tagLabel => (
                <Tag key={tagLabel} variant="gray" className="bg-gray-850">
                  {formatDetailTagLabel(tagLabel)}
                </Tag>
              ))}
            </div>
          </div>
        </div>
        <div aria-hidden className="flex-1" />
      </div>
      <div className="relative z-10 shrink-0">
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
