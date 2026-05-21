import CalendarEmptyState from "@/components/calendar/CalendarEmptyState";
import CalendarProjectCard from "@/components/common/CalendarProjectCard";
import { PRIMARY_CATEGORY_MAP } from "@/constants/competency";
import { formatDateShort, formatDateTitle } from "@/lib/utils/calendar";
import type { CalendarDailyScrum } from "@/types/calendar/calendar";

interface CalendarScrumPreviewProps {
  selectedDate: Date;
  dateKey: string;
  exceeded: boolean;
  hasScrums: boolean;
  previewScrums: CalendarDailyScrum[];
  onDetailClick: () => void;
}

const CalendarScrumPreview = ({
  selectedDate,
  exceeded,
  hasScrums,
  previewScrums,
  onDetailClick,
}: CalendarScrumPreviewProps) => {
  return (
    <>
      <div className="mb-5.5 flex items-center justify-between">
        <h2 className="head-5 text-white">{formatDateTitle(selectedDate)}</h2>
        <button
          type="button"
          className="body-5 cursor-pointer text-gray-700 underline disabled:cursor-not-allowed"
          disabled={!hasScrums}
          onClick={onDetailClick}>
          자세히 보기
        </button>
      </div>

      {exceeded && !hasScrums ? (
        <CalendarEmptyState type="exceeded" />
      ) : !hasScrums ? (
        <CalendarEmptyState type="noScrum" />
      ) : (
        <div className="flex flex-col gap-2">
          {previewScrums.map(scrum => (
            <CalendarProjectCard
              key={scrum.scrumId}
              name={scrum.freeText}
              pjName={scrum.projectName}
              date={formatDateShort(selectedDate)}
              skillTags={
                scrum.primaryCategory ? [PRIMARY_CATEGORY_MAP[scrum.primaryCategory]] : undefined
              }
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CalendarScrumPreview;
