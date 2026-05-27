interface NarrativeSummarySectionProps {
  narrativeSummary: string;
}

const NarrativeSummarySection = ({ narrativeSummary }: NarrativeSummarySectionProps) => {
  return (
    <div className="rounded-12 bg-gray-850 flex flex-col gap-2 p-4">
      <p className="body-3 text-gray-100">통합 서사 요약</p>
      <p className="body-4 text-gray-400">&quot;{narrativeSummary}&quot;</p>
    </div>
  );
};

export default NarrativeSummarySection;
