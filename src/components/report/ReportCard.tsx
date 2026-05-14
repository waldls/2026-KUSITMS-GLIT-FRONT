import { ChevronRightIcon } from "@/assets/icons";
import { Report } from "@/data/report";

const REPORT_TYPE_LABEL: Record<Report["reportType"], string> = {
  CAREER: "커리어 리포트",
  MINI: "미니 리포트",
};

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const label = REPORT_TYPE_LABEL[report.reportType];

  return (
    <div className="border-linear-100 rounded-8 cursor-pointer px-6 py-4">
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
          <span className="body-4 line-clamp-2 text-gray-700">{report.previewText}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
