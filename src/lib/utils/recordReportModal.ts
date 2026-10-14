import type { ReportModalType } from "@/types/record/record";

const PENDING_REPORT_MODAL_KEY = "pending-report-modal";
const PENDING_REPORT_MODAL_EVENT = "pending-report-modal-saved";

const isReportModalType = (value: string | null): value is ReportModalType =>
  value === "MINI" || value === "FULL";
export const savePendingReportModal = (type: ReportModalType) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(PENDING_REPORT_MODAL_KEY, type);
  } catch {}

  window.dispatchEvent(new Event(PENDING_REPORT_MODAL_EVENT));
};

export const consumePendingReportModal = (): ReportModalType | null => {
  if (typeof window === "undefined") return null;

  try {
    const value = window.sessionStorage.getItem(PENDING_REPORT_MODAL_KEY);
    window.sessionStorage.removeItem(PENDING_REPORT_MODAL_KEY);

    return isReportModalType(value) ? value : null;
  } catch {
    return null;
  }
};

export const subscribePendingReportModal = (onSaved: () => void) => {
  window.addEventListener(PENDING_REPORT_MODAL_EVENT, onSaved);

  return () => window.removeEventListener(PENDING_REPORT_MODAL_EVENT, onSaved);
};
