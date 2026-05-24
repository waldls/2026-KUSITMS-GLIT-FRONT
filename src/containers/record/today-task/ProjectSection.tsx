import { PlusIcon, StarOneIcon, ThreeDotsIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";
import Popover from "@/components/common/Popover";
import RecordProjectCard from "@/components/record/RecordProjectCard";
import type { AddedProject } from "@/lib/hooks/record/useDailyScrum";

type ProjectSheetStep = "tag" | "title" | "task";

interface ProjectSectionProps {
  projects: AddedProject[];
  canAddProject: boolean;
  openedProjectMenuId: number | null;
  onOpenProjectSheet: () => void;
  onToggleProjectMenu: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
  onOpenProjectEditSheet: (project: AddedProject, step: ProjectSheetStep) => void;
}

const ProjectSection = ({
  projects,
  canAddProject,
  openedProjectMenuId,
  onOpenProjectSheet,
  onToggleProjectMenu,
  onDeleteProject,
  onOpenProjectEditSheet,
}: ProjectSectionProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 inline-flex w-fit shrink-0 items-center gap-0.25">
        <StarOneIcon className="size-5 shrink-0 text-gray-100" />
        <span className="body-2 inline-flex items-center text-gray-100">프로젝트</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.length > 0 ? (
          <div className="flex flex-col gap-3">
            {projects.map(project => (
              <RecordProjectCard
                key={project.id}
                tag={project.label}
                title={project.title}
                titleClassName="mt-2 mb-1"
                contentClassName="mt-0"
                rightSlot={
                  <div className="relative" data-project-menu>
                    <button
                      type="button"
                      aria-expanded={openedProjectMenuId === project.id}
                      aria-label={`${project.title} 더보기`}
                      onClick={() => onToggleProjectMenu(project.id)}
                      className="flex size-8 cursor-pointer items-center justify-center text-gray-500">
                      <ThreeDotsIcon className="size-5" />
                    </button>

                    {openedProjectMenuId === project.id && (
                      <Popover
                        className="absolute top-0 right-2 z-10 mt-1"
                        onClose={() => onToggleProjectMenu(project.id)}
                        items={[
                          {
                            label: "삭제하기",
                            onClick: () => onDeleteProject(project.id),
                          },
                          {
                            label: "프로젝트 태그 변경",
                            onClick: () => onOpenProjectEditSheet(project, "tag"),
                          },
                          {
                            label: "제목 변경",
                            onClick: () => onOpenProjectEditSheet(project, "title"),
                          },
                          {
                            label: "작업 변경",
                            onClick: () => onOpenProjectEditSheet(project, "task"),
                          },
                        ]}
                      />
                    )}
                  </div>
                }>
                <ol className="flex flex-col gap-0.5">
                  {project.tasks.map((task, index) => (
                    <li key={`${project.id}-${index}`} className="body-5 text-gray-400">
                      {index + 1}. {task}
                    </li>
                  ))}
                </ol>
              </RecordProjectCard>
            ))}
          </div>
        ) : (
          <div className="rounded-8 bg-gray-850/60 flex min-h-29.5 w-full flex-col items-center justify-center">
            <span className="body-5 text-center text-gray-600">
              아직 프로젝트가 없어요
              <br />
              오늘 경험한 일을 기록해봐요
            </span>
          </div>
        )}

        <CTA
          leftIcon={<PlusIcon />}
          disabled={!canAddProject}
          className="mt-3.5 mb-4 shrink-0"
          onClick={onOpenProjectSheet}>
          프로젝트 추가하기
        </CTA>
      </div>
    </div>
  );
};

export default ProjectSection;
