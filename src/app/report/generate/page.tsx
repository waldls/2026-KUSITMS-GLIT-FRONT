"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import characterLiedown from "@/assets/images/report/character_liedown.png";
import { GenerateStatus, getMockGenerateStatus } from "@/data/report";
import { getProgressStep } from "@/lib/utils/report";

const Page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [status, setStatus] = useState<GenerateStatus>("GENERATING");

  const progress = status === "SUCCESS" ? 100 : animatedProgress;

  const title =
    type === "mini" ? "미니 리포트를 생성하고 있어요!" : "커리어 리포트를 생성하고 있어요!";

  // 폴링: 2초마다 상태 조회
  useEffect(() => {
    if (status === "SUCCESS" || status === "FAILED") return;

    const poll = setInterval(() => {
      const res = getMockGenerateStatus();
      setStatus(res.data.status);
    }, 2000);

    return () => clearInterval(poll);
  }, [status]);

  // 진행률 애니메이션: 초반 빠르게, 후반 느리게
  useEffect(() => {
    if (status !== "GENERATING" || animatedProgress >= 99) return;

    const { delay, step } = getProgressStep(animatedProgress);

    const timer = setTimeout(() => {
      setAnimatedProgress(prev => Math.min(prev + step, 99));
    }, delay);

    return () => clearTimeout(timer);
  }, [status, animatedProgress]);

  return (
    <section className="bg-star-complete-gradient flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="star-complete-wave" aria-hidden />
      <div className="star-analysis-wind star-analysis-wind-blue" aria-hidden />
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src={characterLiedown}
          alt="리포트 생성 중"
          width={173}
          height={104}
          loading="eager"
        />
        <p className="animate-star-complete-copy head-3 pb-1 text-gray-100">{title}</p>
        <p className="animate-star-complete-copy text-typo-tertiary body-2 pb-7">
          최대 1분 정도 소요될 수 있어요.
        </p>
        <p className="animate-star-complete-copy body-3 text-gradient-100">{progress}% 완료</p>
      </div>
    </section>
  );
};

export default Page;
