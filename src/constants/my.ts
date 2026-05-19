import {
  DesignerIcon,
  DeveloperIcon,
  FireIcon,
  PlannerIcon,
  SchoolIcon,
  WorkIcon,
} from "@/assets/icons";

export type MenuItemConfig =
  | { label: string; href: string }
  | { label: string; action: "logout" | "withdraw" };

export const MENU_ITEMS: MenuItemConfig[] = [
  { label: "프로필 관리", href: "/my/profile" },
  { label: "서비스 이용 가이드", href: "/my/guide" },
  { label: "알림설정", href: "/my/alarm" },
  { label: "개인정보처리방침", href: "/my/privacy" },
  { label: "로그아웃", action: "logout" },
  { label: "회원탈퇴", action: "withdraw" },
];

export const JOB_OPTIONS = [
  { label: "기획자", Icon: PlannerIcon },
  { label: "디자이너", Icon: DesignerIcon },
  { label: "개발자", Icon: DeveloperIcon },
];

export const STATUS_OPTIONS = [
  { label: "재학 중", Icon: SchoolIcon },
  { label: "취업 준비 중", Icon: FireIcon },
  { label: "재직 중", Icon: WorkIcon },
];
