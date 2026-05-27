import CalendarProjectCard from "@/components/common/CalendarProjectCard";
import RecordCounterWidget from "@/components/report/RecordCounterWidget";
import type { DailySelectableRecord } from "@/types/report/report";

interface SelectedItem extends DailySelectableRecord {
  date: string; // "YYYY-MM-DD"
}

interface SelectedRecordSectionProps {
  items: SelectedItem[];
  totalCount: number;
  selectedCount: number;
  isActive?: boolean;
}

const formatDateDot = (dateStr: string): string => {
  const [, m, d] = dateStr.split("-");
  return `${m}.${d}`;
};

const SelectedRecordSection = ({
  items,
  totalCount,
  selectedCount,
  isActive,
}: SelectedRecordSectionProps) => (
  <div className="flex flex-col gap-2">
    <RecordCounterWidget
      selectedCount={selectedCount}
      totalCount={totalCount}
      isActive={isActive}
    />

    {/* 선택된 기록 목록 */}
    {items.length > 0 && (
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <CalendarProjectCard
            key={item.starRecordId}
            name={item.scrumContent}
            pjName={item.projectName}
            date={formatDateDot(item.date)}
          />
        ))}
      </div>
    )}
  </div>
);

export default SelectedRecordSection;
