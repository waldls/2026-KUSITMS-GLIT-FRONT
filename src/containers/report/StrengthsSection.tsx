import type { Strength } from "@/data/report";

interface StrengthsSectionProps {
  strengths: Strength[];
}

const StrengthCard = ({ strength }: { strength: Strength }) => (
  <div className="rounded-12 flex-1 bg-gray-300 px-3 py-4">
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <p className="body-3 text-black">{strength.title}</p>
        <p className="body-4 text-gray-900">{strength.description}</p>
      </div>
      <div className="flex flex-col gap-1">
        {strength.evidenceRecords.map(record => (
          <p key={record.starRecordId} className="body-5 text-gray-700 underline">
            [{record.title}] {record.recordedAt}
          </p>
        ))}
      </div>
    </div>
  </div>
);

const StrengthsSection = ({ strengths }: StrengthsSectionProps) => {
  const pair = strengths.slice(0, 2);
  const rest = strengths.slice(2);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-3.5">
        {pair.map(strength => (
          <StrengthCard key={strength.title} strength={strength} />
        ))}
      </div>
      {rest.map(strength => (
        <StrengthCard key={strength.title} strength={strength} />
      ))}
    </div>
  );
};

export default StrengthsSection;
