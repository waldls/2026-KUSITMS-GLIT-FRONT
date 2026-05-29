import {
  DesignerIcon,
  DeveloperIcon,
  FireIcon,
  PlannerIcon,
  SchoolIcon,
  WorkIcon,
} from "@/assets/icons";
import guideOne from "@/assets/images/guide/guide_one.png";
import guideThree from "@/assets/images/guide/guide_three.png";
import guideTwo from "@/assets/images/guide/guide_two.png";

export type MenuItemConfig =
  | { label: string; href: string }
  | { label: string; action: "logout" | "withdraw" };

export const MENU_ITEMS: MenuItemConfig[] = [
  { label: "프로필 관리", href: "/my/profile" },
  { label: "서비스 이용 가이드", href: "/my/guide" },
  { label: "알림설정", href: "/my/alarm" },
  {
    label: "개인정보처리방침",
    href: "https://pie-adapter-6d6.notion.site/36edf277bb9880579bf2c487f834c58b",
  },
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

export const GUIDE_LIST = [
  {
    image: guideOne,
    title: "하루의 경험을 기록해요",
    description: "프로젝트 태그부터 작업 내용까지 한번에 작성할 수 있어요",
  },
  {
    image: guideTwo,
    title: "직무 역량 태그로 경험을 표현해요",
    description: "오늘의 경험을 잘 보여주는 직무 역량을 고를 수 있어요",
  },
  {
    image: guideThree,
    title: "3단계 질문으로 경험을 커리어 기록으로",
    description: "각 질문을 따라 기록하고, 나만의 커리어 기록을 완성해요",
  },
];
