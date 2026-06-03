import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import GaugeBar from "@/components/report/GaugeBar";
import CareerReportSection from "@/containers/report/CareerReportSection";
import CreateReportCTA from "@/containers/report/CreateReportCTA";
import { getGauge, getReports } from "@/lib/apis/report/report.server";
import { cn } from "@/lib/utils/cn";

const page = async () => {
  const [progress, reportsData] = await Promise.all([getGauge(), getReports()]);
  if (!progress) return null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <Header title="리포트" leftIcon={null} />
        <div className="px-5 pb-7.5">
          <p
            className={cn(
              "body-4",
              progress.isGeneratable ? "text-sea-blue-400" : "text-offwhite-800",
            )}>
            {progress.isGeneratable ? "리포트 생성이 가능해요!" : "다음 리포트까지 남은 단계"}
          </p>
          <div className="flex justify-between pt-1 pb-2.25">
            <span className="head-3 text-gray-100">심화 기록</span>
            <span
              className={cn(
                "flex items-end",
                progress.currentCount >= progress.nextThreshold
                  ? "body-3 text-sea-blue-200"
                  : "body-2 text-offwhite-800",
              )}>
              {progress.currentCount}/{progress.nextThreshold}
            </span>
          </div>
          <GaugeBar progressRate={progress.progressRate} isGeneratable={progress.isGeneratable} />
        </div>
        <CareerReportSection reportsData={reportsData} />
      </div>
      <div className="px-5 pb-5.75">
        <CreateReportCTA isGeneratable={progress.isGeneratable} />
      </div>
      <NavigationBar />
    </div>
  );
};

export default page;
