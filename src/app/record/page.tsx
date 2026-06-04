"use client";

import Image from "next/image";
import { useState } from "react";

import { ChevronRightIcon, StarOneIcon } from "@/assets/icons";
import recordCharacter from "@/assets/images/record/record_character.png";
import Tag from "@/components/common/Tag";
import { useMe } from "@/lib/hooks/user/userClient";
import { cn } from "@/lib/utils/cn";
import { navigateRecord } from "@/lib/utils/recordNavigation";

const Page = () => {
  const { data: profile } = useMe();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const nickname = profile?.nickname?.trim();
  const streakDays = profile?.consecutiveRecordDays ?? 0;

  return (
    <div className="flex flex-col">
      {/* 타이틀 영역 */}
      <div className="flex shrink-0 flex-col items-center pt-4 pb-6">
        <h2 className="head-3 text-center text-gray-100">
          {nickname ? (
            <>
              {nickname}님의 소중한 경험을 <br /> 기록으로 남겨보세요
            </>
          ) : (
            <>
              소중한 경험을 <br /> 기록으로 남겨보세요
            </>
          )}
        </h2>
        <Tag variant="gray" className="bg-gray-850 mt-2.5">
          <StarOneIcon className="text-tag-300 size-4" />
          <span>{streakDays}일 연속 기록 중</span>
        </Tag>
      </div>

      {/* 캐릭터 이미지 */}
      <div className="flex shrink-0 justify-center pt-24.25">
        <div className="relative aspect-168/196 w-full max-w-52.25 overflow-visible">
          <Image
            src={recordCharacter}
            alt="기록 캐릭터"
            width={168}
            height={196}
            priority
            sizes="(max-width: 430px) 100vw, 209px"
            className={cn(
              "size-full object-contain transition-opacity duration-200",
              isImageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
      </div>

      {/* 하단 카드 */}
      <button
        type="button"
        onClick={() => navigateRecord("/record/today-task")}
        className="rounded-12 relative mt-6.25 mb-2 flex min-h-40 w-full shrink-0 cursor-pointer flex-col items-start justify-start overflow-hidden border-[0.3px] border-solid border-gray-800 bg-[linear-gradient(126deg,rgba(17,17,17,0.20)_6.6%,rgba(173,173,173,0.20)_106.5%)] px-4.5 pt-4 text-left">
        <div className="bg-sea-blue-800 pointer-events-none absolute right-0 bottom-0 h-40 w-53.5 translate-x-1/4 translate-y-1/2 rounded-full opacity-40 blur-[85px]" />
        <p className="body-5 mb-0.5 text-gray-100">오늘 한 일을 간단히 기록해요</p>
        <div className="flex items-center gap-1">
          <h3 className="head-4 text-white">기록하러 가기</h3>
          <ChevronRightIcon className="size-5 text-white" />
        </div>
      </button>
    </div>
  );
};

export default Page;
