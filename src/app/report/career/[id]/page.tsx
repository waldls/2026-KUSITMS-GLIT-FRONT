"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/common/Header";
import MoreStep from "@/components/report/MoreStep";
import BrandingEvidenceSection from "@/containers/report/career/BrandingEvidenceSection";
import BrandingTitleSection from "@/containers/report/career/BrandingTitleSection";
import ExperienceHighlightsSection from "@/containers/report/career/ExperienceHighlightsSection";
import InterviewQuestionsSection from "@/containers/report/career/InvterviewQuestionsSection";
import NarrativeSummarySection from "@/containers/report/career/NarrativeSummarySection";
import PatternSection from "@/containers/report/career/PatternSection";
import StrengthsSection from "@/containers/report/career/StrengthsSection";
import { getReportDetail } from "@/lib/apis/report/report";
import { useMe } from "@/lib/hooks/user/userClient";
import type { CareerReportDetail } from "@/types/report/report";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const { data: me } = useMe();
  const [data, setData] = useState<CareerReportDetail | null>(null);

  useEffect(() => {
    getReportDetail(Number(params.id))
      .then(res => {
        if (res?.reportType === "CAREER") setData(res);
        else router.push("/report");
      })
      .catch(() => router.push("/report"));
  }, [params.id, router]);

  if (!data) return null;

  const { createdAt, selectedStarCount, content } = data;
  const {
    brandingStatement,
    brandingPattern,
    topDetailTags,
    narrativeSummary,
    strengths,
    experienceHighlights,
    interviewQuestions,
  } = content;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title="커리어 리포트" onLeftClick={() => router.push("/report")} />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="body-5 pb-0.5 text-gray-600">{createdAt}</p>
            <p className="head-4 pb-2 text-gray-100">{me?.nickname}님의 커리어 리포트가 나왔어요</p>
            <p className="body-5 text-sea-blue-500">
              벌써 {selectedStarCount}개의 심화기록이 쌓였어요!
            </p>
            <p className="body-5 text-gray-300">얼마나 열심히 기록했는지 확인해볼까요?</p>
          </div>
          <div className="flex flex-col gap-4">
            <BrandingTitleSection brandingStatement={brandingStatement} />
            <BrandingEvidenceSection topDetailTags={topDetailTags} />
            <PatternSection pattern={brandingPattern} />
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
