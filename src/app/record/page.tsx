import Image from "next/image";
import Link from "next/link";

import { ChevronRightIcon, StarOneIcon } from "@/assets/icons";
import RecordCharacter from "@/assets/images/record/record_character.png";
import Tag from "@/components/common/Tag";

import { RECORD_HOME_MOCK } from "../../data/record/mock";

const page = () => {
  return (
    <>
      {/* 타이틀 영역 */}
      <div className="flex shrink-0 flex-col items-center pt-4 pb-6">
        <h2 className="head-3 text-center text-gray-100">
          {RECORD_HOME_MOCK.userName}님의 소중한 경험을 <br /> 기록으로 남겨보세요
        </h2>
        <Tag variant="gray" className="bg-gray-850 mt-2.5">
          <StarOneIcon className="text-tag-300 size-4" />
          <span>{RECORD_HOME_MOCK.streakDays}일 연속 기록 중</span>
        </Tag>
      </div>

      {/* 캐릭터 영역 */}
      <div className="relative h-75 shrink-0">
        <Image
          src={RecordCharacter}
          alt="기록 캐릭터"
          width={460}
          height={460}
          className="absolute inset-0 h-full w-full object-contain pb-4"
        />
      </div>

      {/* 하단 카드 */}
      <Link
        href="/record/today-task"
        className="rounded-12 z-10 mb-2 flex min-h-38.75 w-full shrink-0 cursor-pointer flex-col items-start justify-start border-[0.3px] border-solid border-gray-800 bg-[linear-gradient(126deg,rgba(17,17,17,0.20)_6.6%,rgba(173,173,173,0.20)_106.5%)] px-4.5 pt-4 text-left">
        <p className="body-5 mb-0.5 text-gray-100">오늘 한 일을 간단히 기록해요</p>
        <div className="flex items-center gap-1">
          <h3 className="head-4 text-white">기록 하러가기</h3>
          <ChevronRightIcon className="size-5 text-white" />
        </div>
      </Link>
    </>
  );
};

export default page;
