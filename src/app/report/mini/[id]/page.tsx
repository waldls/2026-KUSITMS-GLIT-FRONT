import { redirect } from "next/navigation";

import MoreStep from "@/components/report/MoreStep";
import ReportDetailHeader from "@/components/report/ReportDetailHeader";
import ActivitySummarySection from "@/containers/report/mini/ActivitySummarySection";
import CompetencyStatsSection from "@/containers/report/mini/CompetencyStatsSection";
import MostRecordSection from "@/containers/report/mini/MostRecordSection";
import NextFocusPointSection from "@/containers/report/mini/NextFocusPointSection";
import TopDetailTagsSection from "@/containers/report/mini/TopDetailTagsSection";
import { getReportById } from "@/lib/apis/report/report.server";
import { getMe } from "@/lib/apis/user/user.server";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  let data;
  try {
    data = await getReportById(Number(id));
  } catch {
    redirect("/report");
  }

  if (!data || data.reportType !== "MINI") redirect("/report");

  const me = await getMe();
  const { createdAt, selectedStarCount, content } = data;
  const { competencyFrequency, topDetailTags, activitySummary, nextFocusPoint } = content;

  return (
    <div className="flex h-screen w-full flex-col">
      <ReportDetailHeader title="미니 리포트" />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4 pb-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="body-5 pb-0.5 text-gray-600">{createdAt}</p>
                  <p className="head-4 pb-2 text-gray-100">
                    {me?.nickname}님의 미니 리포트가 나왔어요
                  </p>
                  <p className="body-5 text-sea-blue-500">
                    벌써 {selectedStarCount}개의 심화기록이 쌓였어요!
                  </p>
                  <p className="body-5 text-gray-300">얼마나 열심히 기록했는지 확인해볼까요?</p>
                </div>
                <CompetencyStatsSection topCategories={competencyFrequency} />
              </div>
              <TopDetailTagsSection topDetailTags={topDetailTags} nickname={me?.nickname} />
            </div>
            <MoreStep />
            <MostRecordSection topCategories={competencyFrequency} topDetailTags={topDetailTags} />
          </div>
          <div className="flex flex-col gap-4">
            <ActivitySummarySection activitySummary={activitySummary} />
            <NextFocusPointSection nextFocusPoint={nextFocusPoint} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
