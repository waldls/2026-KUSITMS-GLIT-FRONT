"use client";

import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import BrandingEvidenceSection from "@/components/report/BrandingEvidenceSection";
import BrandingTitleSection from "@/components/report/BrandingTitleSection";
import ExperienceHighlightsSection from "@/components/report/ExperienceHighlightsSection";
import InterviewQuestionsSection from "@/components/report/InvterviewQuestionsSection";
import MoreStep from "@/components/report/MoreStep";
import NarrativeSummarySection from "@/components/report/NarrativeSummarySection";
import PatternSection from "@/components/report/PatternSection";
import StrengthsSection from "@/components/report/StrengthsSection";
import { mockCareerReportDetail } from "@/data/report";

const Page = () => {
  const router = useRouter();
  const {
    brandingEvidence,
    brandingTitle,
    narrativeSummary,
    strengths,
    experienceHighlights,
    interviewQuestions,
  } = mockCareerReportDetail.content;
  const { pattern } = brandingEvidence;
  const { createdAt, selectedStarCount } = mockCareerReportDetail;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title="커리어 리포트" onLeftClick={() => router.push("/report")} />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="body-5 pb-0.5 text-gray-600">{createdAt}</p>
            <p className="head-4 pb-2 text-gray-100">다솔님의 커리어 리포트가 나왔어요</p>
            <p className="body-5 text-sea-blue-500">
              벌써 {selectedStarCount}개의 심화기록이 쌓였어요!
            </p>
            <p className="body-5 text-gray-300">얼마나 열심히 기록했는지 확인해볼까요?</p>
          </div>
          <div className="flex flex-col gap-4">
            <BrandingTitleSection brandingTitle={brandingTitle} />
            <BrandingEvidenceSection brandingEvidence={brandingEvidence} />
            <PatternSection pattern={pattern} />
          </div>
        </div>
        <MoreStep className="pt-1.5 pb-2.5" />
        <div className="flex flex-col gap-5">
          <NarrativeSummarySection narrativeSummary={narrativeSummary} />
          <StrengthsSection strengths={strengths} />
          <ExperienceHighlightsSection experienceHighlights={experienceHighlights} />
          <InterviewQuestionsSection interviewQuestions={interviewQuestions} />
        </div>
      </div>
    </div>
  );
};

export default Page;
