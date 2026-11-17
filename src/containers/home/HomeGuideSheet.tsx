"use client";

import "swiper/css";

import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import guide1 from "@/assets/images/home/guide_1.png";
import guide2 from "@/assets/images/home/guide_2.png";
import guide3 from "@/assets/images/home/guide_3.png";
import BottomSheet from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import SwipeIndicator from "@/components/common/SwipeIndicator";
import { GUIDE_LIST } from "@/constants/my";

const VISUALS = [guide1, guide2, guide3];

interface HomeGuideSheetProps {
  isOpen: boolean;
  onStart: () => void;
}

const HomeGuideSheet = ({ isOpen, onStart }: HomeGuideSheetProps) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLast = currentIndex === GUIDE_LIST.length - 1;

  return (
    // 배경 탭으로 닫히지 않고 "시작하기"로만 닫힘
    <BottomSheet isOpen={isOpen} onOverlayClick={() => {}}>
      <Swiper onSwiper={setSwiper} onSlideChange={s => setCurrentIndex(s.activeIndex)}>
        {GUIDE_LIST.map((guide, index) => (
          <SwiperSlide key={guide.title} className="px-5">
            <Image src={VISUALS[index]} alt="" className="h-auto w-full" priority={index === 0} />
            <h2 className="head-3 pt-6 pb-0.5 text-white">{guide.title}</h2>
            <p className="body-5 text-gray-700">{guide.description}</p>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-between px-5 pt-8.5 pb-12.5">
        <SwipeIndicator total={GUIDE_LIST.length} current={currentIndex} />
        <Button className="w-26" onClick={isLast ? onStart : () => swiper?.slideNext()}>
          {isLast ? "시작하기" : "다음"}
        </Button>
      </div>
    </BottomSheet>
  );
};

export default HomeGuideSheet;
