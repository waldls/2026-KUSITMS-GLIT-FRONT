"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

import { PlusIcon } from "@/assets/icons";
import CalendarSwiper from "@/components/calendar/CalendarSwiper";
import CTA from "@/components/common/CTA";
import Header from "@/components/common/Header";
import ScrumDatePopover from "@/components/report/ScrumDatePopover";
import SelectedRecordSection from "@/components/report/SelectedRecordSection";
import { MOCK_DAILY_RECORDS, NEXT_REPORT_TYPE } from "@/data/report/mock";
import { toDateKey } from "@/lib/utils/calendar";
import { getMockDailyRecords, getMockScrumDates, getScrumPopoverStyle } from "@/lib/utils/report";
import type { DailySelectableRecord } from "@/types/report/report";

const MIN_SELECT = 10;
const reportTypeLabel = NEXT_REPORT_TYPE === "MINI" ? "미니" : "커리어";

interface SelectedItem extends DailySelectableRecord {
  date: string;
}

const Page = () => {
  const [today] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});

  const dateKey = toDateKey(selectedDate);
  const dateRecords = getMockDailyRecords(dateKey);

  const totalCount = MOCK_DAILY_RECORDS.reduce((acc, d) => acc + d.starRecords.length, 0);

  const selectedItems: SelectedItem[] = [];
  for (const day of MOCK_DAILY_RECORDS) {
    for (const record of day.starRecords) {
      if (selectedIds.has(record.starRecordId)) {
        selectedItems.push({ ...record, date: day.date });
      }
    }
  }

  const canGenerate = selectedIds.size >= MIN_SELECT;

  const toggle = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date ?? today);
  };

  useLayoutEffect(() => {
    if (!calendarRef.current || dateRecords.length === 0) return;
    const style = getScrumPopoverStyle(calendarRef.current);
    if (style) setPopoverStyle(style);
  }, [dateKey, dateRecords.length]);

  return (
    <div className="flex h-full w-full flex-col">
      <Header title={`${reportTypeLabel} 리포트 생성`} />

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="px-4">
          {/* 스와이프 달력 + 날짜 클릭 팝업 */}
          <div className="relative" ref={calendarRef}>
            <CalendarSwiper
              selectedDate={selectedDate}
              today={today}
              scrumDates={getMockScrumDates()}
              exceededMatcher={() => false}
              onSelect={handleSelect}
            />
            {dateRecords.length > 0 && (
              <ScrumDatePopover
                scrums={dateRecords}
                selectedIds={selectedIds}
                onToggle={toggle}
                style={popoverStyle}
              />
            )}
          </div>

          {/* 선택된 심화기록 섹션 */}
          <div className="px-0.75">
            <span className="head-5 mt-10.5 mb-5.5 block text-white">선택된 심화기록</span>
            <SelectedRecordSection
              items={selectedItems}
              totalCount={totalCount}
              selectedCount={selectedIds.size}
              isActive={canGenerate}
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-5.75">
        <CTA disabled={!canGenerate} leftIcon={<PlusIcon />}>
          리포트 생성
        </CTA>
      </div>
    </div>
  );
};

export default Page;
