"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

import CTA from "@/components/common/CTA";
import Popover from "@/components/common/Popover";
import ProgressBar from "@/components/common/ProgressBar";
import DefaultHeartGem from "@/components/record/DefaultHeartGem";
import FilledHeartGem from "@/components/record/FilledHeartGem";
import RecordProjectCard from "@/components/record/RecordProjectCard";
import SkillTag, { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import { SELECT_SKILLS_MOCK } from "@/data/record/mock";
import { cn } from "@/lib/utils/cn";

import { useSkillPopover } from "./hooks/useSkillPopover";

const SELECT_SKILL_OPTIONS = RECORD_SKILL_TAGS;

type SelectedSkillMap = Record<number, number>;

const Page = () => {
  const router = useRouter();
  const [selectedSkillIds, setSelectedSkillIds] = useState<SelectedSkillMap>({});
  const { openedTaskId, popoverPosition, skillTriggerRefs, closePopover, togglePopover } =
    useSkillPopover();

  const totalTaskCount = SELECT_SKILLS_MOCK.projects.reduce(
    (count, project) => count + project.tasks.length,
    0,
  );
  const hasMultipleProjects = SELECT_SKILLS_MOCK.projects.length >= 2;
  const selectedTaskCount = Object.keys(selectedSkillIds).length;
  const isEverySkillSelected = selectedTaskCount === totalTaskCount;

  const handleSkillClick = (taskId: number, skillId: number) => {
    setSelectedSkillIds(prev => ({
      ...prev,
      [taskId]: skillId,
    }));
    closePopover();
  };

  const handleDeepLogClick = () => {
    if (!isEverySkillSelected) return;

    const orderedTasks = SELECT_SKILLS_MOCK.projects.flatMap(project =>
      project.tasks.map(task => ({
        ...task,
        projectId: project.id,
        projectTag: project.tag,
        projectTitle: project.title,
        skillId: selectedSkillIds[task.id],
      })),
    );

    window.sessionStorage.setItem("star-log-tasks", JSON.stringify(orderedTasks));
    router.push("/record/star-log?step=s");
  };

  return (
    <>
      {hasMultipleProjects && (
        <div className="-mx-5 shrink-0">
          <ProgressBar value={selectedTaskCount} max={totalTaskCount} />
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* 이미지 멘트 영역 */}
        <section className="flex shrink-0 flex-col items-center justify-center pt-7.5 pb-5">
          <div className="relative flex size-32 items-center justify-center">
            <DefaultHeartGem
              animateGlow={!isEverySkillSelected}
              ariaHidden={isEverySkillSelected}
              ariaLabel="직무 역량 하트"
              glowLevel={2}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isEverySkillSelected ? "opacity-0" : "opacity-100",
              )}
            />
            <FilledHeartGem
              animateGlow={isEverySkillSelected}
              ariaHidden={!isEverySkillSelected}
              ariaLabel="직무 역량 하트"
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isEverySkillSelected ? "opacity-100" : "opacity-0",
              )}
            />
          </div>

          <h2 className="head-4 mt-3.75 text-center text-white">직무 역량을 달아주세요</h2>
          <p className="body-5 text-center text-gray-500">
            오늘의 경험을 가장 잘 표현하는 직무 역량을 선택해요
          </p>
        </section>

        {/* 프로젝트 역량 선택 카드 목록 */}
        <section className="mt-3.75 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SELECT_SKILLS_MOCK.projects.map(project => (
            <RecordProjectCard
              key={project.id}
              tag={project.tag}
              title={project.title}
              titleClassName="mt-1.5"
              contentClassName="flex flex-col gap-1.5">
              {project.tasks.map(task => {
                const selectedSkillId = selectedSkillIds[task.id];
                const selectedSkill = SELECT_SKILL_OPTIONS.find(
                  skill => skill.id === selectedSkillId,
                );
                const isSkillListOpen = openedTaskId === task.id;

                return (
                  <div key={task.id} className="flex items-center gap-2">
                    <div
                      data-skill-select-menu
                      ref={element => {
                        skillTriggerRefs.current[task.id] = element;
                      }}
                      className="relative shrink-0">
                      <SkillTag
                        skillId={selectedSkillId}
                        aria-expanded={isSkillListOpen}
                        onClick={() => togglePopover(task.id)}>
                        {selectedSkill?.label}
                      </SkillTag>
                    </div>

                    <p className="body-2 min-w-0 flex-1 truncate text-white">{task.title}</p>
                  </div>
                );
              })}
            </RecordProjectCard>
          ))}
        </section>

        {/* 심화 기록하기 CTA 영역 */}
        <div className="relative z-0 shrink-0 py-4">
          <CTA disabled={!isEverySkillSelected} onClick={handleDeepLogClick}>
            심화 기록하기
          </CTA>
        </div>

        {openedTaskId !== null &&
          popoverPosition &&
          createPortal(
            <div
              data-skill-select-menu
              className="fixed z-[100] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={popoverPosition}>
              <Popover
                className="w-37.5"
                onClose={closePopover}
                items={SELECT_SKILL_OPTIONS.map(skill => ({
                  label: skill.label,
                  dotClassName: skill.colorClassName,
                  selected: selectedSkillIds[openedTaskId] === skill.id,
                  onClick: () => handleSkillClick(openedTaskId, skill.id),
                }))}
              />
            </div>,
            document.body,
          )}
      </div>
    </>
  );
};

export default Page;
