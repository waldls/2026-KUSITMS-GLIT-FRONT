"use client";

import { useEffect, useState } from "react";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import LoadingScreen from "@/components/common/LoadingScreen";
import Modal from "@/components/common/Modal";
import RecordProjectCard from "@/components/record/RecordProjectCard";
import DefaultHeartGem from "@/components/record/stones/DefaultHeartGem";
import { bulkCreate } from "@/lib/apis/record/starRecord";
import { cn } from "@/lib/utils/cn";
import { navigateRecord } from "@/lib/utils/recordNavigation";
import {
  type DeepLogProject,
  getTodayTaskScrums,
  mapTodayTaskScrumsToDeepLogProjects,
  saveDeepLogSelectedScrums,
} from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";

const getInitialDeepLogState = () => {
  const storedScrums = getTodayTaskScrums();
  const projects = storedScrums ? mapTodayTaskScrumsToDeepLogProjects(storedScrums) : [];
  const validTaskIds = new Set(projects.flatMap(project => project.tasks.map(task => task.id)));
  const selectedTaskIds = useRecordDraftStore
    .getState()
    .deepLogSelectedTaskIds.filter(id => validTaskIds.has(id));

  return { projects, selectedTaskIds };
};

const Page = () => {
  const setDraft = useRecordDraftStore(state => state.setDraft);
  const [initialState] = useState(getInitialDeepLogState);
  const [projects] = useState<DeepLogProject[]>(initialState.projects);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>(initialState.selectedTaskIds);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSavingSelectedScrums, setIsSavingSelectedScrums] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("today-task-navigate-complete"));
  }, []);

  useEffect(() => {
    setDraft({ deepLogSelectedTaskIds: selectedTaskIds });
  }, [selectedTaskIds, setDraft]);

  const toggleTask = (taskId: number) => {
    setSelectedTaskIds(prev => {
      const next = prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId];

      setDraft({ deepLogSelectedTaskIds: next });

      return next;
    });
  };

  const handlePreviousClick = () => {
    navigateRecord("/record/today-task");
  };

  const selectedCount = selectedTaskIds.length;
  const glowLevel = selectedCount >= 4 ? 3 : selectedCount >= 2 ? 2 : selectedCount;

  const handleNextClick = () => {
    if (selectedCount === 0) return;

    setIsConfirmModalOpen(true);
  };

  const handleConfirmClick = async () => {
    if (isSavingSelectedScrums) return;

    setIsConfirmModalOpen(false);
    setIsSavingSelectedScrums(true);
    setApiErrorMessage("");

    try {
      const selectedScrumIds = projects.flatMap(project =>
        project.tasks.filter(task => selectedTaskIds.includes(task.id)).map(task => task.id),
      );
      const response = await bulkCreate({
        items: selectedScrumIds.map(scrumId => ({ scrumId })),
      });

      if (!response?.items || response.items.length !== selectedScrumIds.length) {
        throw new Error("starRecordId를 확인하지 못했어요");
      }
      if (response.items.some(item => !item.starRecordId)) {
        throw new Error("starRecordId를 확인하지 못했어요");
      }

      saveDeepLogSelectedScrums(
        projects,
        selectedTaskIds,
        selectedScrumIds.reduce<Record<number, number>>((acc, scrumId, index) => {
          acc[scrumId] = response.items![index].starRecordId!;
          return acc;
        }, {}),
      );
      navigateRecord("/record/select-skills");
    } catch {
      setApiErrorMessage("심화기록을 시작하지 못했어요");
      setIsSavingSelectedScrums(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 이미지 멘트 영역 */}
      <section className="flex shrink-0 flex-col items-center justify-center pb-5">
        <DefaultHeartGem ariaLabel="심화 기록 하트" glowLevel={glowLevel} className="mt-9.75" />

        <h2 className="head-4 mt-3.75 text-center text-white">
          {selectedCount === 0
            ? "심화 기록할 작업을 골라주세요"
            : `${selectedCount}개를 선택했어요`}
        </h2>
        <p className="body-5 text-center text-gray-500">
          {selectedCount === 0
            ? "1개 이상 선택해주세요"
            : selectedCount === 1
              ? "더 추가하거나 바로 시작해요"
              : "순서대로 심화 기록을 진행해요"}
        </p>
      </section>

      {/* 프로젝트 스크럼 카드 목록 */}
      <section className="mt-2 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.length > 0 ? (
          projects.map(project => (
            <RecordProjectCard
              key={project.id}
              tag={project.tag}
              title={project.title}
              titleClassName="mt-1.5"
              contentClassName="flex flex-col gap-1.5">
              {project.tasks.map(task => {
                const isChecked = selectedTaskIds.includes(task.id);

                return (
                  <div key={task.id} className="flex items-center gap-2 py-1">
                    <Checkbox checked={isChecked} onChange={() => toggleTask(task.id)} />
                    <button
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => toggleTask(task.id)}
                      className="body-2 min-w-0 flex-1 cursor-pointer truncate text-left text-white">
                      {task.title}
                    </button>
                  </div>
                );
              })}
            </RecordProjectCard>
          ))
        ) : (
          <div className="rounded-8 bg-gray-850/60 flex min-h-29.5 w-full flex-col items-center justify-center">
            <span className="body-5 text-center text-gray-600">
              작성된 스크럼이 없어요
              <br />
              오늘의 작업을 먼저 기록해주세요
            </span>
          </div>
        )}
      </section>

      {/* 이전 다음 버튼 영역 */}
      <div className="flex shrink-0 gap-2 pt-4 pb-10 md:pb-5">
        <Button
          size="lg"
          variant="gray"
          onClick={handlePreviousClick}
          className="text-offwhite-500 flex-[1.5] bg-gray-400/40">
          이전
        </Button>
        <Button
          size="lg"
          disabled={selectedCount === 0}
          className={cn(
            "flex-[3.5]",
            selectedCount > 0 ? "bg-white text-gray-900" : "text-offwhite-500 bg-gray-400/40",
          )}
          onClick={handleNextClick}>
          다음
        </Button>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-y-0 left-1/2 z-70 w-full max-w-107.5 min-w-93.75 -translate-x-1/2">
          <Modal
            isOpen={isConfirmModalOpen}
            type="double"
            title="선택한 스크럼대로 진행할까요?"
            contents="선택한 스크럼에 대한 모든 심화기록을 작성해야 기록돼요"
            btnLLabel="수정하기"
            btnRLabel="진행하기"
            onBtnLClick={() => setIsConfirmModalOpen(false)}
            onBtnRClick={handleConfirmClick}
            onClose={() => setIsConfirmModalOpen(false)}
          />
        </div>
      )}

      {isSavingSelectedScrums && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-gray-900">
          <LoadingScreen className="bg-transparent" />
        </div>
      )}

      <Modal
        isOpen={apiErrorMessage.length > 0}
        type="single"
        title={apiErrorMessage}
        btnLabel="확인"
        onBtnClick={() => setApiErrorMessage("")}
        onClose={() => setApiErrorMessage("")}
      />
    </div>
  );
};

export default Page;
