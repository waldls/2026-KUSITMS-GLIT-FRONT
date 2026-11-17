"use client";

import { useSyncExternalStore } from "react";

import {
  BookIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExportIcon,
  TabsIcon,
  ThreeDotsIcon,
} from "@/assets/icons";
import Header from "@/components/common/Header";
import AppIcon from "@/components/home/AppIcon";
import { isAndroid } from "@/lib/utils/a2hs";

const noop = () => () => {};

const IOS_TOOLBAR = (
  <div className="rounded-12 flex h-16 items-center justify-between bg-gray-800 px-5 text-gray-600 [&_svg]:size-6">
    <ChevronLeftIcon />
    <ChevronRightIcon />
    <span className="rounded-8 bg-white p-2 text-gray-900">
      <ExportIcon />
    </span>
    <BookIcon />
    <TabsIcon />
  </div>
);

const ANDROID_TOOLBAR = (
  <div className="rounded-12 flex h-16 items-center justify-end bg-gray-800 px-5">
    {/* ThreeDotsIcon은 stroke 색이 고정이라 강조 배경 위에서 덮어씀 */}
    <span className="rounded-8 bg-white p-2 [&_path]:stroke-gray-900 [&_svg]:size-6">
      <ThreeDotsIcon />
    </span>
  </div>
);

const ADD_TO_HOME_MENU = (
  <div className="rounded-12 flex h-16 items-center bg-gray-800 px-3">
    <div className="rounded-8 border-sea-blue-400 bg-gray-850 flex flex-1 items-center justify-between border px-4 py-3">
      <span className="body-3 text-white">홈 화면에 추가</span>
      <span className="rounded-4 relative size-4.5 border-[1.5px] border-white">
        <span className="absolute top-1/2 left-1/2 h-[1.5px] w-2 -translate-1/2 bg-white" />
        <span className="absolute top-1/2 left-1/2 h-2 w-[1.5px] -translate-1/2 bg-white" />
      </span>
    </div>
  </div>
);

const LAUNCH_APP = (
  <div className="rounded-12 to-sea-blue-400 flex h-16 items-center justify-center bg-linear-to-r from-[#0b8893]">
    <AppIcon size={40} />
  </div>
);

const getSteps = (android: boolean) => [
  android
    ? { label: "브라우저 우측 상단 메뉴(⋮) 탭", illust: ANDROID_TOOLBAR }
    : { label: "브라우저 하단 공유 버튼 탭", illust: IOS_TOOLBAR },
  { label: "홈 화면에 추가 선택", illust: ADD_TO_HOME_MENU },
  { label: "홈 화면에 추가된 glit 실행", illust: LAUNCH_APP },
];

const Page = () => {
  // 서버에선 iOS 화면으로 렌더하고 클라이언트에서 OS 판정
  const android = useSyncExternalStore(noop, isAndroid, () => false);

  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto px-5 pt-1.5 pb-8">
        <span className="body-5 bg-gray-850 text-sea-blue-400 w-fit rounded-full px-3 py-1">
          앱스토어 다운로드 없이
        </span>
        <h1 className="head-2 pt-3 text-white">
          홈 화면에 glit을
          <br />
          추가해보세요
        </h1>
        <p className="body-4 pt-3 text-gray-500">세 단계면 앱처럼 바로 열 수 있어요</p>
        <ol className="flex flex-col gap-3 pt-8">
          {getSteps(android).map((step, index) => (
            <li key={step.label} className="rounded-16 bg-gray-850 flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <span className="body-5 bg-sea-blue-400 flex size-5 items-center justify-center rounded-full text-gray-900">
                  {index + 1}
                </span>
                <span className="body-3 text-white">{step.label}</span>
              </div>
              {step.illust}
            </li>
          ))}
        </ol>
        {!android && (
          <div className="text-sea-blue-400 mt-auto flex flex-col items-center gap-1 pt-8">
            <span className="body-5">아래 공유 버튼을 눌러주세요</span>
            <ChevronDownIcon className="size-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
