"use client";

import "swiper/css";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Header from "@/components/common/Header";
import SwipeIndicator from "@/components/common/SwipeIndicator";
import { GUIDE_LIST } from "@/constants/my";

const Page = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex h-full w-full flex-col">
      <Header title="서비스 이용 가이드" onLeftClick={() => router.push("/my")} />
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
    </div>
  );
};

export default Page;
