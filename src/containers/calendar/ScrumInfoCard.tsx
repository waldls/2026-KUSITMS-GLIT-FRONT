import Tag, { type TagVariant } from "@/components/common/Tag";

const CATEGORY_MAP: Record<string, { label: string; variant: TagVariant }> = {
  PLANNING_EXECUTION: { label: "기획/실행", variant: "tag100" },
  DISCOVERY_ANALYSIS: { label: "발견/분석", variant: "tag200" },
  COLLABORATION: { label: "협업/조율", variant: "tag300" },
  PROBLEM_SOLVING: { label: "문제해결/개선", variant: "tag400" },
  REFLECTION_GROWTH: { label: "성찰/성장", variant: "tag500" },
};

interface ScrumInfoCardProps {
  freeText: string;
  scrumContent: string;
  primaryCategory: string;
  detailTags: string[];
  images: { imageId: number; imageUrl: string; sortOrder: number }[];
}

const ScrumInfoCard = ({
  freeText,
  scrumContent,
  primaryCategory,
  detailTags,
  images,
}: ScrumInfoCardProps) => {
  return (
    <div className="bg-card rounded-12 p-4 text-white">
      <div className="flex flex-col gap-3">
        <div>
          <p className="body-5 text-gray-300">{freeText}</p>
          <p className="body-3 text-gray-100">{scrumContent}</p>
        </div>
        <div className="flex flex-row gap-1">
          <Tag variant={CATEGORY_MAP[primaryCategory]?.variant}>
            {CATEGORY_MAP[primaryCategory]?.label ?? primaryCategory}
          </Tag>
          {detailTags.map(tag => (
            <Tag key={tag} variant="gray">
              # {tag}
            </Tag>
          ))}
        </div>
        <div className="flex flex-row gap-3">
          {/* TODO: 발급 받은 URL을 Image 태그로 렌더링 */}
          {images.map(img => (
            <div key={img.imageId} className="rounded-8 size-23.5 bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrumInfoCard;
