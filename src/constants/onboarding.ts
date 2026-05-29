import type { StaticImageData } from "next/image";

import ApplicantImg from "@/assets/images/onboarding/applicant.png";
import ApplicantSelectedImg from "@/assets/images/onboarding/applicant-selected.png";
import DesignerImg from "@/assets/images/onboarding/designer.png";
import DesignerSelectedImg from "@/assets/images/onboarding/designer-selected.png";
import DeveloperImg from "@/assets/images/onboarding/developer.png";
import DeveloperSelectedImg from "@/assets/images/onboarding/developer-selected.png";
import EmployeeImg from "@/assets/images/onboarding/employee.png";
import EmployeeSelectedImg from "@/assets/images/onboarding/employee-selected.png";
import PlannerImg from "@/assets/images/onboarding/planner.png";
import PlannerSelectedImg from "@/assets/images/onboarding/planner-selected.png";
import StudentImg from "@/assets/images/onboarding/student.png";
import StudentSelectedImg from "@/assets/images/onboarding/student-selected.png";

export interface SelectionOption {
  value: string;
  label: string;
  icon: StaticImageData;
  selectedIcon: StaticImageData;
}

export const JOB_OPTIONS: SelectionOption[] = [
  { value: "디자이너", label: "디자이너", icon: DesignerImg, selectedIcon: DesignerSelectedImg },
  { value: "기획자", label: "기획자", icon: PlannerImg, selectedIcon: PlannerSelectedImg },
  { value: "개발자", label: "개발자", icon: DeveloperImg, selectedIcon: DeveloperSelectedImg },
];

export const STATUS_OPTIONS: SelectionOption[] = [
  { value: "재학 중", label: "재학중", icon: StudentImg, selectedIcon: StudentSelectedImg },
  {
    value: "취업 준비 중",
    label: "취업 준비중",
    icon: ApplicantImg,
    selectedIcon: ApplicantSelectedImg,
  },
  { value: "재직 중", label: "재직중", icon: EmployeeImg, selectedIcon: EmployeeSelectedImg },
];
