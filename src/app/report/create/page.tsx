import Header from "@/components/common/Header";
import CreateReportForm from "@/containers/report/create/CreateReportForm";
import { getSelectableInfo } from "@/lib/apis/report/report.server";

const page = async () => {
  const info = await getSelectableInfo();
  if (!info) return null;

  const reportTypeLabel = info.reportType === "MINI" ? "미니" : "커리어";

  return (
    <div className="flex h-full w-full flex-col">
      <Header title={`${reportTypeLabel} 리포트 생성`} />
      <CreateReportForm {...info} />
    </div>
  );
};

export default page;
