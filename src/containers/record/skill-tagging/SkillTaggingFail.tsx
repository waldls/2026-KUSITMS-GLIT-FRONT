import Link from "next/link";
import { useEffect } from "react";

import CTA from "@/components/common/CTA";
import { clearRecordSession, markRecordFlowCompleted } from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";

const finalizeRecordFlow = () => {
  useRecordDraftStore.getState().reset();
  clearRecordSession();
  markRecordFlowCompleted();
};

function SkillTaggingFail() {
  useEffect(() => {
    finalizeRecordFlow();
  }, []);
  return (
    <section className="relative -mx-5 flex min-h-full flex-col px-5 pb-10">
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <h1 className="head-4 mt-3.75 text-center text-white">
          아쉽게도 세부 역량 태그
          <br />
          추출을 못 했어요
        </h1>
        <p className="body-5 mt-0.25 text-center text-gray-500">
          태그가 없어도 기록은 잘 쌓이고 있어요
        </p>
      </div>
      <div className="relative z-10 shrink-0">
        <Link href="/" onClick={finalizeRecordFlow}>
          <CTA>홈으로 돌아가기</CTA>
        </Link>
      </div>
    </section>
  );
}

export default SkillTaggingFail;
