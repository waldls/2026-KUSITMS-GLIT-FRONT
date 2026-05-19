import Image from "next/image";
import Link from "next/link";

import HeartImage from "@/assets/images/record/hearts-3.png";
import CTA from "@/components/common/CTA";

function SkillTaggingFail() {
  return (
    <section className="relative -mx-5 flex min-h-0 flex-1 flex-col overflow-hidden px-5">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <Image src={HeartImage} alt="역량 태깅 실패" width={128} height={128} priority />
        </div>
        <h1 className="head-4 mt-3.75 text-center text-white">
          아쉽게도 세부 역량 태그
          <br />
          추출을 못 했어요
        </h1>
        <p className="body-5 mt-0.25 text-center text-gray-500">
          태그가 없어도 기록은 잘 쌓이고 있어요
        </p>
      </div>
      <div className="relative z-10 shrink-0 py-4">
        <Link href="/">
          <CTA>홈으로 돌아가기</CTA>
        </Link>
      </div>
    </section>
  );
}

export default SkillTaggingFail;
