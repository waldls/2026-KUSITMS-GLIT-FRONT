"use client";

import "swiper/css";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import CTA from "@/components/common/CTA";
import SwipeIndicator from "@/components/common/SwipeIndicator";
import { GUIDE_LIST } from "@/constants/my";
import { usePostOnboardingComplete } from "@/lib/hooks/user/usePostOnboardingComplete";
import { useOnboardingStore } from "@/store/onboardingStore";

const Page = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { nickname, jobRole, userStatus } = useOnboardingStore();
  const { mutate, isPending } = usePostOnboardingComplete();

  const handleComplete = () => {
    mutate({ nickname, jobRole, userStatus }, { onSuccess: () => router.replace("/") });
  };

  return (
    <div className="flex h-full w-full flex-col px-5">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Swiper className="w-full" onSlideChange={swiper => setCurrentIndex(swiper.activeIndex)}>
          {GUIDE_LIST.map((guide, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center gap-10">
                <div className="text-center">
                  <h1 className="head-3 pb-0.5 text-white">{guide.title}</h1>
                  <h2 className="body-5 text-gray-700">{guide.description}</h2>
                </div>
                <Image
                  src={guide.image}
                  alt={guide.title}
                  width={268}
                  height={414}
                  loading="eager"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-4.5">
          <SwipeIndicator total={GUIDE_LIST.length} current={currentIndex} />
        </div>
      </div>
      <div className="pb-10">
        <button
          className="body-5 mb-2 w-full cursor-pointer text-gray-700 underline"
          disabled={isPending}
          onClick={handleComplete}>
          건너뛰기
        </button>
        <CTA
          disabled={currentIndex !== GUIDE_LIST.length - 1 || isPending}
          onClick={handleComplete}>
          시작해 볼까요?
        </CTA>
      </div>
    </div>
  );
};

export default Page;
