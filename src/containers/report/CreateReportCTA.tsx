"use client";

import { useRouter } from "next/navigation";

import { PlusIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";

const CreateReportCTA = ({ isGeneratable }: { isGeneratable: boolean }) => {
  const router = useRouter();

  return (
    <CTA
      variant="default"
      leftIcon={<PlusIcon />}
      disabled={!isGeneratable}
      onClick={() => router.push("/report/create")}>
      리포트 생성
    </CTA>
  );
};

export default CreateReportCTA;
