import Link from "next/link";

import { StarTwoIcon } from "@/assets/icons";
import Button from "@/components/common/Button";
import ReportCard from "@/components/report/ReportCard";
import type { ReportsData } from "@/types/report/report";

interface Props {
  reportsData: ReportsData | null;
}

const CareerReportSection = ({ reportsData }: Props) => {
  const reports = reportsData?.reports ?? [];

  const parseDate = (d: string) => new Date(d.replace(/\./g, "-"));

  const careerIndexMap = new Map(
    [...reports]
      .filter(r => r.reportType === "CAREER")
      .sort((a, b) => parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime())
      .map((r, i) => [r.reportId, i + 1]),
  );

  return (
    <div className="rounded-20 border-t-gray-850 border-b-gray-850 flex flex-col gap-4 border-t border-b px-5 py-7.5">
      <p className="head-5 pl-1 text-gray-100">내 커리어 리포트</p>
      <div className="scrollbar-hide flex h-71 flex-col gap-4 overflow-y-auto">
        {reports.length > 0 ? (
          reports.map(report => (
            <ReportCard
              key={report.reportId}
              report={report}
              careerIndex={careerIndexMap.get(report.reportId)}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <StarTwoIcon className="size-15 text-gray-700" />
                <p className="body-2 text-offwhite-800">아직 발행된 리포트가 없어요!</p>
              </div>
              <Link href="/record/today-task">
                <Button className="bg-white active:bg-gray-300">지금 기록하러 가기</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerReportSection;
