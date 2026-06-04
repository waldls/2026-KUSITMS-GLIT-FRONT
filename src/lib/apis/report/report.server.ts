import { serverApi } from "@/lib/apis/server";
import type {
  ReportDetailResponse,
  ReportGauge,
  ReportsData,
  SelectableInfo,
} from "@/types/report/report";

// 리포트 목록 조회
export const getReports = () => serverApi.get<ReportsData>("/api/reports");

// 리포트 생성용 사전 정보 조회
export const getSelectableInfo = () =>
  serverApi.get<SelectableInfo>("/api/reports/selectable-info");

// 리포트 게이지 조회
export const getGauge = () => serverApi.get<ReportGauge>("/api/reports/gauge");

// 리포트 상세 조회
export const getReportById = (reportId: number) =>
  serverApi.get<ReportDetailResponse>(`/api/reports/${reportId}`);
