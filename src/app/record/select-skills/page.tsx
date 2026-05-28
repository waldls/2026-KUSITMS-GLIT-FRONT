"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import CTA from "@/components/common/CTA";
import LoadingScreen from "@/components/common/LoadingScreen";
import Popover from "@/components/common/Popover";
import ProgressBar from "@/components/common/ProgressBar";
import RecordProjectCard from "@/components/record/RecordProjectCard";
import SkillTag, { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import DefaultHeartGem from "@/components/record/stones/DefaultHeartGem";
import GlowingSkillStone, { type SkillStoneId } from "@/components/record/stones/GlowingSkillStone";
import SkillBlur from "@/components/record/stones/SkillBlur";
import { type Competency, updateCompetency } from "@/lib/apis/record/scrum";
import { useSkillPopover } from "@/lib/hooks/record/useSkillPopover";
import { navigateRecord } from "@/lib/utils/recordNavigation";
import {
  DEEP_LOG_SELECTED_SCRUMS_KEY,
  type DeepLogProject,
  STAR_LOG_TASKS_KEY,
} from "@/lib/utils/recordSession";

const SELECT_SKILL_OPTIONS = RECORD_SKILL_TAGS;

type SelectedSkillMap = Record<number, number>;
type SelectedSkillEntry = { taskId: number; skillId: SkillStoneId };

const getStoredProjects = () => {
  const stored = window.sessionStorage.getItem(DEEP_LOG_SELECTED_SCRUMS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as { projects?: DeepLogProject[] };
    return parsed.projects?.length ? parsed.projects : [];
  } catch {
    return [];
  }
};

const getCompetency = (skillId: number): Competency => {
  switch (skillId) {
    case 1:
      return "DISCOVERY_ANALYSIS";
    case 2:
      return "PLANNING_EXECUTION";
    case 3:
      return "COLLABORATION";
    case 4:
      return "PROBLEM_SOLVING";
    case 5:
      return "REFLECTION_GROWTH";
    default:
      return "DISCOVERY_ANALYSIS";
  }
};

const Page = () => {
  const [projects, setProjects] = useState<DeepLogProject[] | null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<SelectedSkillMap>({});
  const [selectedSkillEntries, setSelectedSkillEntries] = useState<SelectedSkillEntry[]>([]);
  const [isSavingCompetencies, setIsSavingCompetencies] = useState(false);
  const { openedTaskId, popoverPosition, skillTriggerRefs, closePopover, togglePopover } =
    useSkillPopover();

  const selectedProjects = projects ?? [];
  const totalTaskCount = selectedProjects.reduce(
    (count, project) => count + project.tasks.length,
    0,
  );
  const hasMultipleProjects = selectedProjects.length >= 2;
  const selectedTaskCount = Object.keys(selectedSkillIds).length;
  const isEverySkillSelected = selectedTaskCount === totalTaskCount;
  const firstSelectedSkillId = selectedSkillEntries[0]?.skillId;
  const blurSkillIds = selectedSkillEntries.slice(1).map(entry => entry.skillId);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const storedProjects = getStoredProjects();

      if (storedProjects.length === 0) {
        navigateRecord("/record/deep-log", { replace: true });
        return;
      }

      setProjects(storedProjects);
    }, 0);

    return () => {
      window.clearTimeout(restoreTimer);
    };
  }, []);

  const handleSkillClick = (taskId: number, skillId: number) => {
    setSelectedSkillIds(prev => ({
      ...prev,
      [taskId]: skillId,
    }));
    setSelectedSkillEntries(prev => {
      const nextSkillId = skillId as SkillStoneId;
      const existingEntryIndex = prev.findIndex(entry => entry.taskId === taskId);

      if (existingEntryIndex === -1) {
        return [...prev, { taskId, skillId: nextSkillId }];
      }

      return prev.map((entry, index) =>
        index === existingEntryIndex ? { ...entry, skillId: nextSkillId } : entry,
      );
    });
    closePopover();
  };

  const handleDeepLogClick = async () => {
    if (!projects || !isEverySkillSelected || isSavingCompetencies) return;

    setIsSavingCompetencies(true);

    const orderedTasks = selectedProjects.flatMap(project =>
      project.tasks.map(task => {
        const skillId = selectedSkillIds[task.id];

        return {
          ...task,
          projectId: project.id,
          projectTag: project.tag,
          projectTitle: project.title,
          skillId,
          competency: getCompetency(skillId),
        };
      }),
    );

    try {
      await updateCompetency({
        items: orderedTasks.map(task => ({
          scrumId: task.id,
          competency: getCompetency(task.skillId),
        })),
      });
      window.sessionStorage.setItem(STAR_LOG_TASKS_KEY, JSON.stringify(orderedTasks));
      navigateRecord("/record/star-log?step=s");
    } catch {
      setIsSavingCompetencies(false);
    }
  };

  if (!projects) return null;

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
            {firstSelectedSkillId ? (
              <GlowingSkillStone
                skillId={firstSelectedSkillId}
                animate={isEverySkillSelected}
                ariaLabel="처음 선택한 직무 역량 원석"
                className="relative z-10 size-26.25"
              />
            ) : (
              <DefaultHeartGem
                animateGlow
                ariaLabel="직무 역량 하트"
                glowLevel={1}
                className="relative z-10"
              />
            )}
            <div className="@container-[size] pointer-events-none absolute inset-0 z-20">
              {blurSkillIds.map((skillId, index) => (
                <SkillBlur
                  key={`${skillId}-${index}`}
                  skillId={skillId}
                  animate={isEverySkillSelected}
                />
              ))}
            </div>
          </div>

          <h2 className="head-4 mt-3.75 text-center text-white">직무 역량을 달아주세요</h2>
          <p className="body-5 text-center text-gray-500">
            오늘의 경험을 가장 잘 표현하는 직무 역량을 선택해요
          </p>
        </section>

        {/* 프로젝트 역량 선택 카드 목록 */}
        <section className="mt-3.75 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {selectedProjects.map(project => (
            <RecordProjectCard
              key={project.id}
              tag={project.tag}
              title={project.title}
              titleClassName="mt-1.5"
              contentClassName="flex flex-col gap-4">
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
        <div className="relative z-0 shrink-0 pt-4 pb-10 md:pb-4">
          <CTA
            disabled={!isEverySkillSelected || isSavingCompetencies}
            onClick={handleDeepLogClick}>
            심화 기록하기
          </CTA>
        </div>

        {openedTaskId !== null &&
          popoverPosition &&
          createPortal(
            <div
              data-skill-select-menu
              className="fixed z-100 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      {isSavingCompetencies && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-gray-900">
          <LoadingScreen className="bg-transparent" />
        </div>
      )}
    </>
  );
};

export default Page;
