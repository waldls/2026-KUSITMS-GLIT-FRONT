"use client";

import Image from "next/image";

import Tag from "@/components/common/Tag";
import { PRIMARY_CATEGORY_MAP } from "@/constants/competency";

interface ScrumInfoCardProps {
  freeText?: string;
  scrumContent?: string;
  primaryCategory?: string;
  detailTags?: string[];
  images?: { imageId?: number; imageUrl?: string; sortOrder?: number }[];
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
        <div className="flex flex-wrap gap-1">
          {primaryCategory && (
            <Tag variant={PRIMARY_CATEGORY_MAP[primaryCategory]?.variant}>
              {PRIMARY_CATEGORY_MAP[primaryCategory]?.label ?? primaryCategory}
            </Tag>
          )}
          {detailTags?.map(tag => (
            <Tag key={tag} variant="gray">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      {images?.some(img => img.imageUrl) && (
        <div className="mt-3 flex flex-row gap-3">
          {images.map((img, index) =>
            img.imageUrl ? (
              <div
                key={img.imageId ?? index}
                className="rounded-8 relative size-23.5 overflow-hidden">
                <Image src={img.imageUrl} alt="" fill sizes="23.5rem" className="object-cover" />
              </div>
            ) : (
              <div key={img.imageId ?? index} className="rounded-8 size-23.5 bg-gray-200" />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default ScrumInfoCard;
