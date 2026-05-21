"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Modal from "@/components/common/Modal";
import DefaultHeartGem from "@/components/record/DefaultHeartGem";
import RecordProjectCard from "@/components/record/RecordProjectCard";
import { DEEP_LOG_MOCK } from "@/data/record/mock";
import { cn } from "@/lib/utils/cn";

const Page = () => {
  const router = useRouter();
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const toggleTask = (taskId: number) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId],
    );
  };

  const selectedCount = selectedTaskIds.length;
  const glowLevel = selectedCount >= 4 ? 3 : selectedCount >= 2 ? 2 : selectedCount;

  const handleNextClick = () => {
    if (selectedCount === 0) return;

    setIsConfirmModalOpen(true);
  };

  const handleConfirmClick = () => {
    router.push("/record/select-skills");
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
        {DEEP_LOG_MOCK.projects.map(project => (
          <RecordProjectCard
            key={project.id}
            tag={project.tag}
            title={project.title}
            titleClassName="mt-1.5"
            contentClassName="flex flex-col gap-1.5">
            {project.tasks.map(task => {
              const isChecked = selectedTaskIds.includes(task.id);
              return (
                <div key={task.id} className="flex items-center gap-2">
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
        ))}
      </section>

      {/* 이전 다음 버튼 영역 */}
      <div className="flex shrink-0 gap-2 py-4">
        <Button
          size="lg"
          variant="gray"
          onClick={() => router.back()}
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
        <div className="fixed inset-y-0 left-1/2 z-[70] w-full max-w-107.5 min-w-93.75 -translate-x-1/2">
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
    </div>
  );
};

export default Page;
