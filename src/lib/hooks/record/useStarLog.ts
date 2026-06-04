import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

import type { StarImageAttachment } from "@/containers/record/star-log/StarImageUploader";
import { getStarGuideExample } from "@/data/record/starGuides";
import {
  type AiTaggingResultResponse,
  getResult,
  getStatus,
  postAiTagging,
} from "@/lib/apis/record/record";
import { deleteImageId, getImages } from "@/lib/apis/record/starImage";
import { postSteps } from "@/lib/apis/record/starRecord";
import { useMe } from "@/lib/hooks/user/userClient";
import {
  ANALYZING_STATUS_POLL_LIMIT,
  createStarLogStepHref,
  getInitialCompletedStarRecordIds,
  getInitialStarLogStepIndex,
  getInitialStarLogTasks,
  getInitialStarLogViewState,
  normalizeStarLogImageUrl,
  replaceSkillTaggingView,
  replaceStarLogHistory,
  replaceStarLogViewState,
  saveCompletedStarRecordIds,
  STAR_STEPS,
  type StarLogTask,
  type StarLogViewState,
  type StarStep,
  triggeredAiTaggingKeys,
  uploadStarLogImage,
} from "@/lib/utils/record/starLog";
import { navigateRecord } from "@/lib/utils/recordNavigation";

type ImageAttachmentMap = Record<number, StarImageAttachment[]>;

export const useStarLog = () => {
  const imageAttachmentsRef = useRef<ImageAttachmentMap>({});
  const aiTaggingStatusPollCountRef = useRef(0);
  const { data: profile } = useMe();
  const [tasks] = useState<StarLogTask[]>(getInitialStarLogTasks);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedTaskIndex, setCompletedTaskIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(getInitialStarLogStepIndex);
  const [viewState, setViewState] = useState<StarLogViewState>(getInitialStarLogViewState);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Partial<Record<StarStep, string>>>>({});
  const [imageAttachments, setImageAttachments] = useState<ImageAttachmentMap>({});
  const [completedStarRecordIds, setCompletedStarRecordIds] = useState<number[]>(
    getInitialCompletedStarRecordIds,
  );
  const [aiTaggingResults, setAiTaggingResults] = useState<AiTaggingResultResponse[] | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const currentTask = tasks[taskIndex];
  const currentStep = STAR_STEPS[stepIndex];
  const currentGuideExample = currentTask
    ? getStarGuideExample({
        job: profile?.jobRole,
        competency: currentTask.competency,
        skillId: currentTask.skillId,
        stepKey: currentStep.key,
      })
    : "";
  const answer = currentTask ? (answers[currentTask.id]?.[currentStep.key] ?? "") : "";
  const hasAnswer = answer.trim().length > 0;
  const isLastStep = stepIndex === STAR_STEPS.length - 1;
  const isLastTask = taskIndex === tasks.length - 1;
  const currentStarRecordId = currentTask?.starRecordId;
  const currentImageAttachments = currentTask ? (imageAttachments[currentTask.id] ?? []) : [];
  const isUploadingImage = currentImageAttachments.some(image => image.isUploading);
  const starRecordIdList = tasks
    .map(task => task.starRecordId)
    .filter((starRecordId): starRecordId is number => Boolean(starRecordId));
  const starRecordIdKey = starRecordIdList.join(",");
  const hasCompletedAllTasks =
    tasks.length > 0 &&
    starRecordIdList.length === tasks.length &&
    starRecordIdList.every(starRecordId => completedStarRecordIds.includes(starRecordId));

  const replaceStep = (nextStepIndex: number, direction?: "left" | "right") => {
    setAnimationDirection(direction ?? (nextStepIndex < stepIndex ? "left" : "right"));
    setViewState("form");
    setStepIndex(nextStepIndex);
    replaceStarLogHistory(createStarLogStepHref(nextStepIndex));
  };

  useEffect(() => {
    if (tasks.length === 0) navigateRecord("/record/select-skills", { replace: true });
  }, [tasks]);

  useEffect(() => {
    if (viewState !== "form") return;
    replaceStarLogHistory(createStarLogStepHref(stepIndex));
  }, [stepIndex, viewState]);

  useEffect(() => {
    if (viewState !== "allComplete") return;
    if (!hasCompletedAllTasks) return;

    return ((redirectTimer: number) => () => {
      window.clearTimeout(redirectTimer);
    })(
      window.setTimeout(() => {
        replaceStarLogViewState("analyzing", stepIndex, setViewState);
      }, 3500),
    );
  }, [hasCompletedAllTasks, stepIndex, viewState]);

  useEffect(() => {
    if (viewState !== "analyzing" && viewState !== "delayed") return;
    if (!hasCompletedAllTasks) {
      replaceStarLogViewState("allComplete", stepIndex, setViewState);
      return;
    }

    const aiTaggingStarRecordIds = tasks
      .map(task => task.starRecordId)
      .filter((starRecordId): starRecordId is number => Boolean(starRecordId));
    let ignore = false;
    let pollingTimer: number | undefined;
    const taggingStorageKey = `star-log-ai-tagging:${starRecordIdKey}`;
    const isAnalyzing = viewState === "analyzing";

    if (isAnalyzing) {
      aiTaggingStatusPollCountRef.current = 0;
    }

    const scheduleNextPoll = () => {
      pollingTimer = window.setTimeout(() => {
        void pollAiTagging();
      }, 1500);
    };

    const pollAiTagging = async () => {
      try {
        aiTaggingStatusPollCountRef.current += 1;

        const statuses = await Promise.all(aiTaggingStarRecordIds.map(getStatus));
        if (ignore) return;

        if (statuses.some(status => status?.status === "FAILED")) {
          replaceSkillTaggingView("fail", setViewState);
          return;
        }

        if (statuses.every(status => status?.status === "SUCCESS")) {
          const nextResults = await Promise.all(aiTaggingStarRecordIds.map(getResult));
          if (ignore) return;

          if (nextResults.some(result => result?.status !== "SUCCESS")) {
            throw new Error("AI 태깅 결과를 찾지 못했어요");
          }

          setAiTaggingResults(
            nextResults.filter((result): result is AiTaggingResultResponse => result !== null),
          );
          replaceSkillTaggingView("success", setViewState);
          return;
        }
      } catch {
        if (ignore) return;
      }

      if (
        viewState === "analyzing" &&
        aiTaggingStatusPollCountRef.current >= ANALYZING_STATUS_POLL_LIMIT
      ) {
        replaceStarLogViewState("delayed", stepIndex, setViewState);
        return;
      }

      scheduleNextPoll();
    };

    const startAiTagging = async () => {
      try {
        if (aiTaggingStarRecordIds.length === 0) {
          replaceSkillTaggingView("fail", setViewState);
          return;
        }

        if (!triggeredAiTaggingKeys.has(taggingStorageKey)) {
          await Promise.all(aiTaggingStarRecordIds.map(postAiTagging));
          triggeredAiTaggingKeys.add(taggingStorageKey);
        }

        await pollAiTagging();
      } catch {
        if (!ignore) replaceSkillTaggingView("fail", setViewState);
      }
    };

    void startAiTagging();

    return () => {
      ignore = true;
      if (pollingTimer) window.clearTimeout(pollingTimer);
    };
  }, [hasCompletedAllTasks, starRecordIdKey, stepIndex, tasks, viewState]);

  useEffect(() => {
    if (!currentStarRecordId || !currentTask) return;

    const taskId = currentTask.id;
    let isMounted = true;

    const fetchImages = async () => {
      try {
        const response = await getImages(currentStarRecordId);
        if (!isMounted) return;
        if (response) {
          const attachments = response.map(item => ({
            id: String(item.starImageId),
            url: normalizeStarLogImageUrl(item.imageUrl),
            starImageId: item.starImageId,
          }));
          setImageAttachments(prev => ({
            ...prev,
            [taskId]: attachments,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    void fetchImages();

    return () => {
      isMounted = false;
    };
  }, [currentStarRecordId, currentTask]);

  useEffect(() => {
    const title =
      viewState === "form"
        ? currentStep.headerTitle
        : viewState === "taskComplete"
          ? "다음 심화기록"
          : viewState === "allComplete"
            ? "기록 완료"
            : "AI 역량 태깅";

    window.dispatchEvent(new CustomEvent("record-title-change", { detail: title }));
    window.dispatchEvent(
      new CustomEvent("record-header-hidden-change", { detail: viewState !== "form" }),
    );

    return () => {
      window.dispatchEvent(new CustomEvent("record-header-hidden-change", { detail: false }));
    };
  }, [currentStep.headerTitle, viewState]);

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

  const handleImageAttachmentsChange: Dispatch<SetStateAction<StarImageAttachment[]>> = action => {
    if (!currentTask) return;

    const taskId = currentTask.id;

    setImageAttachments(prev => ({
      ...prev,
      [taskId]: typeof action === "function" ? action(prev[taskId] ?? []) : action,
    }));
  };

  const handleImageUpload = async (image: StarImageAttachment) => {
    if (!currentTask || !currentStarRecordId) throw new Error("심화기록을 찾을 수 없어요");

    const taskId = currentTask.id;

    try {
      await uploadStarLogImage(currentStarRecordId, image);

      const response = await getImages(currentStarRecordId);
      if (response) {
        setImageAttachments(prev => {
          const currentList = prev[taskId] ?? [];
          const completedAttachments = response.map((item, index) => {
            const localItem = currentList[index];
            const url =
              localItem && localItem.url.startsWith("blob:")
                ? localItem.url
                : normalizeStarLogImageUrl(item.imageUrl);
            return {
              id: String(item.starImageId),
              url,
              starImageId: item.starImageId,
              file: localItem?.file,
            };
          });

          const uploadingItems = currentList.slice(completedAttachments.length);
          return {
            ...prev,
            [taskId]: [...completedAttachments, ...uploadingItems],
          };
        });
      }
    } catch (error) {
      setImageAttachments(prev => ({
        ...prev,
        [taskId]: (prev[taskId] ?? []).filter(item => item.id !== image.id),
      }));
      throw error;
    }
  };

  const handleImageRemove = async (image: StarImageAttachment) => {
    if (!currentTask || !currentStarRecordId) return;

    const taskId = currentTask.id;
    if (!image.starImageId) {
      setImageAttachments(prev => ({
        ...prev,
        [taskId]: (prev[taskId] ?? []).filter(item => item.id !== image.id),
      }));
      return;
    }

    try {
      await deleteImageId(currentStarRecordId, image.starImageId);
      setImageAttachments(prev => ({
        ...prev,
        [taskId]: (prev[taskId] ?? []).filter(item => item.id !== image.id),
      }));
    } catch (error) {
      setApiErrorMessage("이미지를 삭제하지 못했어요");
      try {
        const response = await getImages(currentStarRecordId);
        if (response) {
          const attachments = response.map(item => ({
            id: String(item.starImageId),
            url: normalizeStarLogImageUrl(item.imageUrl),
            starImageId: item.starImageId,
          }));
          setImageAttachments(prev => ({
            ...prev,
            [currentTask.id]: attachments,
          }));
        }
      } catch (fetchError) {
        console.error("Failed to restore images after delete error:", fetchError);
      }
      throw error;
    }
  };

  const handlePrevClick = () => {
    if (stepIndex > 0) {
      replaceStep(stepIndex - 1, "left");
      return;
    }

    setIsExitModalOpen(true);
  };

  const handleNextClick = async () => {
    if (!currentTask || !hasAnswer || !currentStarRecordId || isSavingStep || isUploadingImage) {
      return;
    }

    setIsSavingStep(true);
    setApiErrorMessage("");

    try {
      await postSteps(currentStarRecordId, currentStep.apiStep, { userAnswer: answer.trim() });
    } catch (error) {
      setApiErrorMessage(
        error instanceof Error && error.message ? error.message : "심화기록을 저장하지 못했어요",
      );
      return;
    } finally {
      setIsSavingStep(false);
    }

    if (!isLastStep) {
      replaceStep(stepIndex + 1, "right");
      return;
    }

    setCompletedStarRecordIds(prev => {
      if (prev.includes(currentStarRecordId)) return prev;

      const next = [...prev, currentStarRecordId];
      saveCompletedStarRecordIds(next);
      return next;
    });
    setCompletedTaskIndex(taskIndex);
    replaceStarLogViewState(isLastTask ? "allComplete" : "taskComplete", stepIndex, setViewState);
  };

  const handleNextTaskClick = () => {
    setTaskIndex(completedTaskIndex + 1);
    replaceStep(0, "right");
  };

  return {
    tasks,
    currentTask,
    currentStep,
    currentGuideExample,
    viewState,
    aiTaggingResults,
    animationDirection,
    taskIndex,
    stepIndex,
    completedTaskIndex,
    answer,
    hasAnswer,
    isLastStep,
    currentStarRecordId,
    currentImageAttachments,
    isSavingStep,
    isUploadingImage,
    isExitModalOpen,
    apiErrorMessage,
    handleAnswerChange,
    handleImageAttachmentsChange,
    handleImageUpload,
    handleImageRemove,
    handlePrevClick,
    handleNextClick,
    handleNextTaskClick,
    dismissApiError: () => setApiErrorMessage(""),
    dismissExitModal: () => setIsExitModalOpen(false),
  };
};
