import Image from "next/image";

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

export const JOB_OPTIONS = [
  {
    value: "디자이너",
    label: "디자이너",
    icon: <Image src={DesignerImg} alt="디자이너" fill sizes="136px" className="object-contain" />,
    selectedIcon: (
      <Image
        src={DesignerSelectedImg}
        alt="디자이너"
        fill
        sizes="136px"
        className="object-contain"
      />
    ),
  },
  {
    value: "기획자",
    label: "기획자",
    icon: <Image src={PlannerImg} alt="기획자" fill sizes="136px" className="object-contain" />,
    selectedIcon: (
      <Image src={PlannerSelectedImg} alt="기획자" fill sizes="136px" className="object-contain" />
    ),
  },
  {
    value: "개발자",
    label: "개발자",
    icon: <Image src={DeveloperImg} alt="개발자" fill sizes="136px" className="object-contain" />,
    selectedIcon: (
      <Image
        src={DeveloperSelectedImg}
        alt="개발자"
        fill
        sizes="136px"
        className="object-contain"
      />
    ),
  },
];

export const STATUS_OPTIONS = [
  {
    value: "재학 중",
    label: "재학중",
    icon: <Image src={StudentImg} alt="재학중" fill sizes="136px" className="object-contain" />,
    selectedIcon: (
      <Image src={StudentSelectedImg} alt="재학중" fill sizes="136px" className="object-contain" />
    ),
  },
  {
    value: "취업 준비 중",
    label: "취업 준비중",
    icon: (
      <Image src={ApplicantImg} alt="취업 준비중" fill sizes="136px" className="object-contain" />
    ),
    selectedIcon: (
      <Image
        src={ApplicantSelectedImg}
        alt="취업 준비중"
        fill
        sizes="136px"
        className="object-contain"
      />
    ),
  },
  {
    value: "재직 중",
    label: "재직중",
    icon: <Image src={EmployeeImg} alt="재직중" fill sizes="136px" className="object-contain" />,
    selectedIcon: (
      <Image src={EmployeeSelectedImg} alt="재직중" fill sizes="136px" className="object-contain" />
    ),
  },
];
