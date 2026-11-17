import Image from "next/image";

import characterAppIcon from "@/assets/images/home/character_app_icon.png";
import { cn } from "@/lib/utils/cn";

interface AppIconProps {
  size: number;
  className?: string;
}

// 시안의 앱 아이콘: 검정 배경 위 캐릭터를 크게 확대해 크롭 (크기·위치는 시안 비율)
const AppIcon = ({ size, className }: AppIconProps) => (
  <div
    className={cn("relative shrink-0 overflow-hidden rounded-[22%] bg-black", className)}
    style={{ width: size, height: size }}>
    <Image
      src={characterAppIcon}
      alt=""
      sizes={`${Math.ceil(size * 1.64)}px`}
      className="absolute top-[-2%] left-[-37.2%] h-auto w-[163.8%] max-w-none"
    />
  </div>
);

export default AppIcon;
