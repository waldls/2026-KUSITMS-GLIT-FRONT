import ExceededCharacter from "@/assets/images/calendar/character_exceeded.svg";
import NoScrumCharacter from "@/assets/images/calendar/character_no_scrum.svg";

type CalendarEmptyStateType = "noScrum" | "exceeded";

const CONFIG: Record<
  CalendarEmptyStateType,
  { graphic: React.ReactNode; text: string; whitespace?: boolean }
> = {
  noScrum: {
    graphic: <NoScrumCharacter width={68} height={64} aria-hidden />,
    text: "아직 기록이 없어요.\n기록하러 가볼까요?",
    whitespace: true,
  },
  exceeded: {
    graphic: <ExceededCharacter width={44} height={64} aria-hidden />,
    text: "이 날은 기록이 없어요",
  },
};

const CalendarEmptyState = ({ type }: { type: CalendarEmptyStateType }) => {
  const { graphic, text, whitespace } = CONFIG[type];
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      {graphic}
      <p className={`body-2 text-center text-gray-800 ${whitespace ? "whitespace-pre-line" : ""}`}>
        {text}
      </p>
    </div>
  );
};

export default CalendarEmptyState;
