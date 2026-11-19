"use client";

import { useRouter } from "next/navigation";

import { CancelIcon } from "@/assets/icons";
import BottomSheet from "@/components/common/BottomSheet";
import CTA from "@/components/common/CTA";
import AppIcon from "@/components/home/AppIcon";
import { trackGA } from "@/lib/utils/ga";

interface A2hsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const A2hsSheet = ({ isOpen, onClose }: A2hsSheetProps) => {
  const router = useRouter();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} icon={<CancelIcon />} onIconClick={onClose}>
      <div className="flex flex-col items-center px-5 pt-2.5 pb-6.5 text-center">
        <AppIcon size={72} className="border border-gray-800" />
        <h2 className="head-5 pt-4 text-white">
          홈 화면에 glit을 추가하고
          <br />
          바로 기록을 시작해보세요
        </h2>
        <p className="body-4 pt-2 text-gray-500">앱 설치 없이, 아이콘 하나로 바로 열 수 있어요</p>
        <CTA
          className="mt-7"
          onClick={() => {
            trackGA("a2hs_banner_click");
            router.push("/home/guide");
          }}>
          설치 없이 앱으로 열기
        </CTA>
        <button
          type="button"
          className="body-4 mt-4 cursor-pointer text-gray-700"
          onClick={onClose}>
          오늘은 그냥 볼게요
        </button>
      </div>
    </BottomSheet>
  );
};

export default A2hsSheet;
