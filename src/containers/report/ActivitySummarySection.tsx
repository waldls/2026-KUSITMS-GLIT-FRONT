interface Props {
  activitySummary: string;
}

const ActivitySummarySection = ({ activitySummary }: Props) => {
  return (
    <div className="rounded-12 bg-gray-850 p-4 text-white">
      <div className="flex flex-col gap-2">
        <p className="body-3 text-gray-100">지금까지의 활동요약</p>
        <p className="body-4 text-gray-400">&ldquo;{activitySummary}&rdquo;</p>
      </div>
    </div>
  );
};

export default ActivitySummarySection;
