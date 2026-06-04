interface ExperienceHighlightsSectionProps {
  experienceHighlights?: string[];
}

const ExperienceHighlightsSection = ({
  experienceHighlights = [],
}: ExperienceHighlightsSectionProps) => {
  return (
    <div className="bg-gray-850 rounded-12 p-4">
      <p className="body-3 pb-3 text-gray-100">경험 어필 문장</p>
      {experienceHighlights.map((highlight, i) => (
        <div key={highlight}>
          {i > 0 && <hr className="mt-1.5 mb-3 border-t-[0.6px] border-gray-800" />}
          <p className="body-4 text-gray-400">&quot;{highlight}&quot;</p>
        </div>
      ))}
    </div>
  );
};

export default ExperienceHighlightsSection;
