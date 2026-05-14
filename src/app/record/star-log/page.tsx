"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ProgressBar from "@/components/common/ProgressBar";
import TextArea from "@/components/common/TextArea";
import SkillTag, { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import { SELECT_SKILLS_MOCK, STAR_LOG_MOCK } from "@/data/record/mock";
import { getStarGuideExample } from "@/data/record/starGuides";
import { cn } from "@/lib/utils/cn";

import StarAllComplete from "./components/StarAllComplete";
import StarImageUploader, { type StarImageAttachment } from "./components/StarImageUploader";
import StarTaskComplete from "./components/StarTaskComplete";

const STAR_STEPS = [
  {
    key: "situation",
    param: "st",
    headerTitle: "상황/과제",
    question: "어떤 상황에서 이 일을 맡게 됐고, 목표는 무엇이었나요?",
    placeholder: "3~5문장이면 충분해요",
  },
  {
    key: "action",
    param: "a",
    headerTitle: "행동",
    question: "목표를 위해 어떤 행동을 했고, 그렇게 한 이유도 있었나요?",
    placeholder: "3~5문장이면 충분해요",
  },
  {
    key: "result",
    param: "r",
    headerTitle: "결과",
    question: "어떤 결과로 이어졌고, 이 경험에서 무엇을 배웠나요?",
    placeholder: "3~5문장이면 충분해요",
  },
] as const;

type StarStep = (typeof STAR_STEPS)[number]["key"];
type ViewState = "form" | "taskComplete" | "allComplete";
type ImageAttachmentMap = Record<number, StarImageAttachment[]>;

interface StarTask {
  id: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: number;
}

const fallbackTasks = SELECT_SKILLS_MOCK.projects.flatMap(project =>
  project.tasks.map(task => ({
    ...task,
    projectId: project.id,
    projectTag: project.tag,
    projectTitle: project.title,
    skillId: RECORD_SKILL_TAGS[0].id,
  })),
);

const getInitialTasks = () => {
  if (typeof window === "undefined") return fallbackTasks;

  const storedTasks = window.sessionStorage.getItem("star-log-tasks");

  if (!storedTasks) return fallbackTasks;

  try {
    const parsedTasks = JSON.parse(storedTasks) as StarTask[];
    return parsedTasks.length > 0 ? parsedTasks : fallbackTasks;
  } catch {
    return fallbackTasks;
  }
};

const createStepHref = (pathname: string, searchParams: URLSearchParams, nextStepIndex: number) => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("state");
  params.set("step", STAR_STEPS[nextStepIndex].param);
  return `${pathname}?${params.toString()}`;
};

const createStateHref = (
  pathname: string,
  searchParams: URLSearchParams,
  state: "task-complete" | "all-complete",
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("step");
  params.set("state", state);
  return `${pathname}?${params.toString()}`;
};

const StarLogContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageAttachmentsRef = useRef<ImageAttachmentMap>({});
  const [tasks] = useState<StarTask[]>(getInitialTasks);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedTaskIndex, setCompletedTaskIndex] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Partial<Record<StarStep, string>>>>({});
  const [imageAttachments, setImageAttachments] = useState<ImageAttachmentMap>({});

  const stepParam = searchParams.get("step");
  const stateParam = searchParams.get("state");
  const viewState: ViewState =
    stateParam === "task-complete"
      ? "taskComplete"
      : stateParam === "all-complete"
        ? "allComplete"
        : "form";
  const stepIndex = Math.max(
    0,
    STAR_STEPS.findIndex(step => step.param === stepParam),
  );
  const currentTask = tasks[taskIndex];
  const currentStep = STAR_STEPS[stepIndex];
  const currentGuideExample = currentTask
    ? getStarGuideExample({
        job: STAR_LOG_MOCK.job,
        skillId: currentTask.skillId,
        stepKey: currentStep.key,
      })
    : "";
  const answer = currentTask ? (answers[currentTask.id]?.[currentStep.key] ?? "") : "";
  const currentImageAttachments = currentTask ? (imageAttachments[currentTask.id] ?? []) : [];
  const hasAnswer = answer.trim().length > 0;
  const isLastStep = stepIndex === STAR_STEPS.length - 1;
  const isLastTask = taskIndex === tasks.length - 1;

  const replaceStep = (nextStepIndex: number) => {
    router.replace(createStepHref(pathname, searchParams, nextStepIndex));
  };

  useEffect(() => {
    if (viewState !== "form") return;
    if (stepParam === currentStep.param) return;

    router.replace(createStepHref(pathname, searchParams, stepIndex));
  }, [currentStep.param, pathname, router, searchParams, stepIndex, stepParam, viewState]);

  useEffect(() => {
    const title =
      viewState === "form"
        ? currentStep.headerTitle
        : viewState === "taskComplete"
          ? "다음 심화기록"
          : "기록 완료";

    window.dispatchEvent(new CustomEvent("record-title-change", { detail: title }));
    window.dispatchEvent(
      new CustomEvent("record-header-hidden-change", { detail: viewState !== "form" }),
    );

    return () => {
      window.dispatchEvent(new CustomEvent("record-header-hidden-change", { detail: false }));
    };
  }, [currentStep.headerTitle, viewState]);

  const handleAnswerChange = (value: string) => {
    if (!currentTask) return;

    setAnswers(prev => ({
      ...prev,
      [currentTask.id]: {
        ...prev[currentTask.id],
        [currentStep.key]: value,
      },
    }));
  };

  const handleImageAttachmentsChange = (images: StarImageAttachment[]) => {
    if (!currentTask) return;

    setImageAttachments(prev => ({
      ...prev,
      [currentTask.id]: images,
    }));
  };

  const handlePrevClick = () => {
    if (stepIndex > 0) {
      replaceStep(stepIndex - 1);
      return;
    }

    setIsExitModalOpen(true);
  };

  const handleNextClick = () => {
    if (!currentTask || !hasAnswer) return;

    if (!isLastStep) {
      replaceStep(stepIndex + 1);
      return;
    }

    setCompletedTaskIndex(taskIndex);
    router.replace(
      createStateHref(pathname, searchParams, isLastTask ? "all-complete" : "task-complete"),
    );
  };

  const handleNextTaskClick = () => {
    setTaskIndex(completedTaskIndex + 1);
    replaceStep(0);
  };

  useEffect(() => {
    imageAttachmentsRef.current = imageAttachments;
  }, [imageAttachments]);

  useEffect(() => {
    return () => {
      Object.values(imageAttachmentsRef.current)
        .flat()
        .forEach(image => URL.revokeObjectURL(image.url));
    };
  }, []);

  if (!currentTask) return null;

  if (viewState === "allComplete") {
    return <StarAllComplete />;
  }

  if (viewState === "taskComplete") {
    const nextTask = tasks[completedTaskIndex + 1];

    if (!nextTask) {
      return <StarAllComplete />;
    }

    return (
      <StarTaskComplete
        completedTaskNumber={completedTaskIndex + 1}
        nextTask={nextTask}
        onNextTaskClick={handleNextTaskClick}
      />
    );
  }

  return (
    <>
      <div className="-mx-5 shrink-0">
        <ProgressBar value={stepIndex + 1} max={STAR_STEPS.length} />
      </div>

      {/* 태그 + 제목 + 질문 내용 영역 + 텍스트 작성 영역 */}
      <div className="flex min-h-0 flex-1 flex-col">
        <section className="mt-6.5 flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5">
            <SkillTag skillId={currentTask.skillId} />
            <span className="body-4 truncate text-gray-700">{currentTask.projectTitle}</span>
          </div>

          <h2 className="body-3 mt-3 text-white">{currentStep.question}</h2>
          <p className="body-4 mt-1 mr-7.75 whitespace-pre-line text-gray-700">
            {currentGuideExample}
          </p>

          <TextArea
            className="mt-5"
            placeholder={currentStep.placeholder}
            value={answer}
            onChange={handleAnswerChange}
          />

          {/* 이미지 첨부 영역 (result만 해당) */}
          {currentStep.key === "result" && (
            <StarImageUploader
              images={currentImageAttachments}
              onImagesChange={handleImageAttachmentsChange}
            />
          )}
        </section>

        {/* 이전 다음 버튼 영역 */}
        <div className="flex shrink-0 gap-2 py-4">
          <Button
            size="lg"
            variant="gray"
            onClick={handlePrevClick}
            className="text-offwhite-500 flex-[1.5] bg-gray-400/40">
            이전
          </Button>
          <Button
            size="lg"
            disabled={!hasAnswer}
            className={cn(
              "flex-[3.5]",
              !hasAnswer && "text-offwhite-500 bg-gray-400/40",
              hasAnswer && !isLastStep && "bg-white text-gray-900",
              hasAnswer && isLastStep && "bg-gradient-100 text-gray-900",
            )}
            onClick={handleNextClick}>
            {isLastStep ? "완료" : "다음"}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isExitModalOpen}
        type="double"
        title="정말 그만두시겠어요?"
        contents="지금 나가면 작성 중인 내용이 없어져요"
        btnLLabel="나가기"
        btnRLabel="머무르기"
        onBtnLClick={() => router.back()}
        onBtnRClick={() => setIsExitModalOpen(false)}
        onClose={() => setIsExitModalOpen(false)}
      />
    </>
  );
};

const Page = () => (
  <Suspense>
    <StarLogContent />
  </Suspense>
);

export default Page;
