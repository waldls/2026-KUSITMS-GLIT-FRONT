import Link from "next/link";

import { ChevronRightIcon } from "@/assets/icons";
import type { Report } from "@/types/report/report";

interface ReportCardProps {
  report: Report;
  careerIndex?: number;
}

const ReportCard = ({ report, careerIndex }: ReportCardProps) => {
  const label =
    report.reportType === "CAREER" && careerIndex !== undefined
      ? `${careerIndex}번째 커리어 리포트`
      : report.reportType === "MINI"
        ? "미니 리포트"
        : "커리어 리포트";

  const href = `/report/${report.reportType.toLowerCase()}/${report.reportId}`;

  return (
    <Link href={href} className="border-linear-100 rounded-8 block px-6 py-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-3">
            <p className="body-3 text-white">{label}</p>
            <p className="body-4 text-gray-800">{report.createdAt}</p>
          </div>
          <ChevronRightIcon className="size-6 text-gray-100" />
        </div>
        <div className="flex flex-col gap-1">
          {report.title && <span className="body-2 text-gray-300">{report.title}</span>}
          <span className="body-4 line-clamp-1 text-gray-700">{report.previewText}</span>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
