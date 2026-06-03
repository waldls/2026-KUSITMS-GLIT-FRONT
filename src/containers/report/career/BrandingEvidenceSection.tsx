import Tag from "@/components/common/Tag";
import type { TopTag } from "@/types/report/report";

interface Props {
  topDetailTags?: TopTag[];
}

const BrandingEvidenceSection = ({ topDetailTags = [] }: Props) => {
  const topTags = topDetailTags.slice(0, 3);

  return (
    <div className="bg-gray-850 rounded-12 px-6.75 py-4">
      <div className="flex flex-col items-center gap-2">
        <p className="body-3 text-center text-gray-100">도출 근거</p>
        <div className="flex w-full flex-row justify-between">
          {topTags.map(({ tag, count }) => (
            <div key={tag} className="flex flex-col gap-2">
              <p className="body-3 text-center text-gray-100">{count}회</p>
              <Tag variant="gray">{tag}</Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandingEvidenceSection;
