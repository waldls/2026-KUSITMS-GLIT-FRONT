import { api } from "@/api/client";
import type {
  DailySelectableRecords,
  ReportCreateRequest,
  ReportCreateResponse,
  ReportDetailResponse,
  ReportStatusResponse,
} from "@/types/report/report";

// 날짜별 심화 기록 모달 조회
export const getSelectableRecords = (date: string) =>
  api.get<DailySelectableRecords>(`/api/reports/selectable-records/${date}`);

// 리포트 생성 요청
export const createReport = (body: ReportCreateRequest) =>
  api.post<ReportCreateResponse>("/api/reports", body, { timeout: false });

// 리포트 생성 상태 폴링
export const getReportStatus = (reportId: number) =>
  api.get<ReportStatusResponse>(`/api/reports/${reportId}/status`);

// 리포트 생성 재시도 (1회)
export const retryReport = (reportId: number) =>
  api.post<ReportCreateResponse>(`/api/reports/${reportId}/retry`);

// 리포트 상세 조회
export const getReportDetail = (reportId: number) =>
  api.get<ReportDetailResponse>(`/api/reports/${reportId}`);
