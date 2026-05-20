import Image from "next/image";

import SitDownCharacter from "@/assets/images/report/character_sitdown.png";

interface BrandingTitleSectionProps {
  brandingTitle: string;
}

const BrandingTitleSection = ({ brandingTitle }: BrandingTitleSectionProps) => {
  return (
    <div className="rounded-12 bg-gray-850 relative w-full overflow-hidden p-4 text-white">
      <div className="bg-sea-blue-600 absolute top-1/2 left-0 h-32 w-32 -translate-y-1/2 opacity-40 blur-[100px]" />
      <div className="absolute top-1/2 right-4 size-15 -translate-y-1/2 rounded-full bg-[#F3F3F3] blur-[22px]" />
      <div className="absolute top-[calc(50%+10px)] right-11.5 size-15 rounded-full bg-[#FFC5C5] blur-[22px]" />
      <Image
        src={SitDownCharacter}
        alt="캐릭터"
        className="absolute right-6 -bottom-7"
        width={93}
        height={115}
      />
      <div className="relative w-40">
        <p className="body-3 text-left break-keep text-gray-100">{brandingTitle}</p>
      </div>
    </div>
  );
};

export default BrandingTitleSection;
