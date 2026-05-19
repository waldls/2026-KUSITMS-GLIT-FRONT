"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CancelIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";
import Header from "@/components/common/Header";
import ProgressBar from "@/components/common/ProgressBar";
import TextField from "@/components/common/TextField";
import OnboardingStepHeader from "@/components/onboarding/OnboardingStepHeader";
import SelectionCardGrid from "@/components/onboarding/SelectionCardGrid";
import { NICKNAME_REGEX } from "@/constants/regex";
import { JOB_OPTIONS, STATUS_OPTIONS } from "@/data/onboarding";
import { getNicknameError } from "@/lib/utils/validation";

type Step = 1 | 2 | 3;

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [nickname, setNickname] = useState("");
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const canProceed = useMemo(() => {
    if (step === 1) return NICKNAME_REGEX.test(nickname);
    if (step === 2) return !!jobRole;
    if (step === 3) return !!userStatus;
    return false;
  }, [step, nickname, jobRole, userStatus]);

  const handleBack = () => {
    if (step > 1) setStep(prev => (prev - 1) as Step);
    else router.back();
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => (prev + 1) as Step);
    } else {
      // TODO: API 연동 - { nickname, jobRole, userStatus }
      router.push("/");
    }
  };

  return (
    <>
      <Header title="시작하기" onLeftClick={handleBack} />
      <ProgressBar step={step} />

      <section className="flex flex-1 flex-col overflow-y-auto px-5 pt-8">
        {step === 1 && (
          <>
            <OnboardingStepHeader
              title="닉네임을 입력해주세요!"
              description="닉네임은 2~12자 / 한글, 영문, 숫자만 사용 가능해요."
            />
            <div className="flex flex-1 items-center">
              <TextField
                placeholder="닉네임을 입력해주세요."
                maxLength={12}
                showCount
                value={nickname}
                onChange={e => {
                  setNickname(e.target.value);
                  setNicknameTouched(false);
                }}
                onBlur={() => setNicknameTouched(true)}
                variant={nicknameTouched && getNicknameError(nickname) ? "error" : "default"}
                errorMessage={nicknameTouched ? getNicknameError(nickname) : undefined}
                rightIcon={<CancelIcon />}
                rightIconClassName={nickname ? "text-white" : "text-gray-800"}
                onRightIconClick={() => setNickname("")}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <OnboardingStepHeader
              title="준비중이신 직군을 선택해주세요!"
              description="가장 관심 있거나 자신 있는 역할 1가지를 선택해주세요."
            />
            <div className="flex flex-1 items-center justify-center">
              <SelectionCardGrid options={JOB_OPTIONS} value={jobRole} onChange={setJobRole} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <OnboardingStepHeader
              title="현재 직업 상태를 선택해주세요!"
              description="현재 본인의 상황을 가장 잘 나타내는 항목을 알려주세요."
            />
            <div className="flex flex-1 items-center justify-center">
              <SelectionCardGrid
                options={STATUS_OPTIONS}
                value={userStatus}
                onChange={setUserStatus}
              />
            </div>
          </>
        )}
      </section>

      <div className="px-5 pb-10">
        <CTA disabled={!canProceed} onClick={handleNext}>
          다음으로
        </CTA>
      </div>
    </>
  );
};

export default Page;
