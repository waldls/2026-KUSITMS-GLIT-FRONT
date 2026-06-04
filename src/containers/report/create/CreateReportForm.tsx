"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PlusIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";
import Toast from "@/components/common/Toast";
import SelectedRecordSection from "@/containers/report/create/SelectedRecordSection";
import StarCalendarSection from "@/containers/report/create/StarCalendarSection";
import type { SelectableRecord } from "@/lib/hooks/report/useSelectableRecords";
import { useSelectableRecords } from "@/lib/hooks/report/useSelectableRecords";
import { fromDateKeys, parseDateKey, toDateKey } from "@/lib/utils/calendar";
import type { SelectableInfo } from "@/types/report/report";

const MIN_SELECT: Record<SelectableInfo["reportType"], number> = { MINI: 10, CAREER: 20 };

type CreateReportFormProps = SelectableInfo & {
  initialDateKey: string;
};

const CreateReportForm = ({
  reportType,
  totalStarCount,
  autoSelectedStarRecords,
  starRecordDates,
  initialDateKey,
}: CreateReportFormProps) => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(() => parseDateKey(initialDateKey));
  // 선택된 심화기록 ID 집합
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(autoSelectedStarRecords.map(r => r.starRecordId)),
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const minSelect = MIN_SELECT[reportType];
  const canCreate =
    reportType === "MINI" ? selectedIds.size === minSelect : selectedIds.size >= minSelect;

  // 선택한 날짜 데이터
  const dateKey = toDateKey(selectedDate);
  const { dateRecords, allRecords } = useSelectableRecords(autoSelectedStarRecords, dateKey);

  const selectedIdItems: SelectableRecord[] = allRecords.filter(r =>
    selectedIds.has(r.starRecordId),
  );

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 4000);
  };

  const toggle = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (reportType === "MINI" && prev.size >= minSelect) {
          showToast(`${minSelect}개의 작업만 선택할 수 있어요`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    if (!canCreate || isSubmitting) return;
    setIsSubmitting(true);
    sessionStorage.setItem(
      "pendingReport",
      JSON.stringify({ reportType, starRecordIds: Array.from(selectedIds) }),
    );
    router.push(`/report/generate?type=${reportType === "MINI" ? "mini" : "career"}`);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4">
        <StarCalendarSection
          selectedDate={selectedDate}
          scrumDates={fromDateKeys(starRecordDates)}
          dateRecords={dateRecords}
          selectedIds={selectedIds}
          onSelect={date => setSelectedDate(date ?? new Date())}
          onToggle={toggle}
        />

        <div className="px-0.75">
          <span className="head-5 mt-10.5 mb-5.5 block text-white">선택된 심화기록</span>
          <SelectedRecordSection
            items={selectedIdItems}
            totalCount={totalStarCount}
            selectedCount={selectedIds.size}
            isActive={canCreate}
          />
        </div>
      </div>

      <div className="mb-8.5 shrink-0 px-5">
        <CTA disabled={!canCreate || isSubmitting} leftIcon={<PlusIcon />} onClick={handleGenerate}>
          리포트 생성
        </CTA>
      </div>

      {toastMessage && (
        <div className="absolute right-0 bottom-9.5 left-0 z-40 flex justify-center">
          <Toast contents={toastMessage} variant="error" showCloseButton={false} />
        </div>
      )}
    </div>
  );
};

export default CreateReportForm;
