import Tag from "@/components/common/Tag";

type CalendarLogCardProps = {
  userName: string;
  tags: string[];
};

const CalendarLogCard = ({ userName, tags }: CalendarLogCardProps) => {
  if (!tags.length) return null;

  return (
    <div className="bg-card rounded-12 flex flex-col gap-2 p-4">
      <p className="body-3 text-white">{userName}님이 받은 세부역량태그</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, i) => (
          <Tag key={i} variant="gray">
            # {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default CalendarLogCard;
