import { type SetStateAction, useEffect, useState } from "react";

import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/lib/hooks/record/useProjects";
import { useMe } from "@/lib/hooks/user/userClient";
import { type AddedProject, useRecordDraftStore } from "@/store/recordDraftStore";

export type ProjectSheetStep = "tag" | "title" | "task";
export type ProjectSheetMode = "create" | "edit";
export type ScrumToastState = "hidden" | "visible" | "fading";

const isProjectStepReady = (
  step: ProjectSheetStep,
  selectedTag: string | null,
  title: string,
  tasks: string[],
) => {
  if (step === "tag") return selectedTag !== null;
  if (step === "title") return title.trim().length > 0;
  return tasks.some(task => task.trim().length > 0);
};

const normalizeTasks = (tasks: string[]) => tasks.map(task => task.trim()).filter(Boolean);

const areTasksEqual = (tasksA: string[], tasksB: string[]) => {
  const normalizedTasksA = normalizeTasks(tasksA);
  const normalizedTasksB = normalizeTasks(tasksB);

  return (
    normalizedTasksA.length === normalizedTasksB.length &&
    normalizedTasksA.every((task, index) => task === normalizedTasksB[index])
  );
};

const alignScrumIds = (scrumIds: (number | null)[] | undefined, taskCount: number) => {
  if (!scrumIds) return Array.from({ length: taskCount }, () => null);

  return Array.from({ length: taskCount }, (_, index) => scrumIds[index] ?? null);
};

const getProjectTitleJobLabel = (jobRoleName: string) => {
  if (jobRoleName.includes("기획")) return "기획";
  if (jobRoleName.includes("디자")) return "디자인";
  if (jobRoleName.includes("개발")) return "개발";

  return jobRoleName;
};

export const useDailyScrumProjectSheet = () => {
  const addedProjects = useRecordDraftStore(state => state.addedProjects);
  const setDraft = useRecordDraftStore(state => state.setDraft);
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false);
  const [projectSheetMode, setProjectSheetMode] = useState<ProjectSheetMode>("create");
  const [projectSheetStep, setProjectSheetStep] = useState<ProjectSheetStep>("tag");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [selectedProjectTag, setSelectedProjectTag] = useState<string | null>(null);
  const [isProjectTagEditing, setIsProjectTagEditing] = useState(false);
  const [editingProjectTag, setEditingProjectTag] = useState<string | null>(null);
  const [editingProjectTagValue, setEditingProjectTagValue] = useState("");
  const [isAddingProjectTag, setIsAddingProjectTag] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectTasks, setProjectTasks] = useState<string[]>([]);
  const [openedProjectMenuId, setOpenedProjectMenuId] = useState<number | null>(null);
  const [projectTagToastState, setProjectTagToastState] = useState<ScrumToastState>("hidden");
  const [projectTagToastMessage, setProjectTagToastMessage] = useState("");
  const [isProjectExitModalOpen, setIsProjectExitModalOpen] = useState(false);
  const [createdProjectTagIds, setCreatedProjectTagIds] = useState<number[]>([]);
  const { data: profile } = useMe();
  const { data: projectTagItems = [], isError: isProjectsError } = useProjects();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const jobRoleName = profile?.jobRole?.trim() || "기획자";

  const setAddedProjects = (action: SetStateAction<AddedProject[]>) => {
    const previousProjects = useRecordDraftStore.getState().addedProjects;
    const nextProjects = typeof action === "function" ? action(previousProjects) : action;

    setDraft({ addedProjects: nextProjects });
  };

  const projectTags = projectTagItems.map(projectTag => projectTag.name);
  const createdProjectTags = projectTagItems
    .filter(projectTag => createdProjectTagIds.includes(projectTag.id))
    .map(projectTag => projectTag.name);
  const totalTaskCount = addedProjects.reduce((count, project) => count + project.tasks.length, 0);
  const editingProjectTaskCount =
    editingProjectId === null
      ? 0
      : (addedProjects.find(project => project.id === editingProjectId)?.tasks.length ?? 0);
  const maxProjectTasks =
    projectSheetMode === "edit" && projectSheetStep === "task"
      ? Math.max(0, 5 - totalTaskCount + editingProjectTaskCount)
      : Math.max(0, 5 - totalTaskCount);
  const canAddProject = totalTaskCount < 5;
  const projectTitlePlaceholder = `6/6 ${getProjectTitleJobLabel(jobRoleName)} 작업`;
  const projectTaskPlaceholder = `어드민 페이지 로그인 화면 작업`;

  const showProjectTagToast = (message: string) => {
    setProjectTagToastMessage(message);
    setProjectTagToastState("visible");
  };

  useEffect(() => {
    if (!isProjectsError) return;

    const toastTimer = window.setTimeout(() => {
      showProjectTagToast("프로젝트 태그를 불러오지 못했어요");
    }, 0);

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [isProjectsError]);

  useEffect(() => {
    if (projectTagToastState === "hidden") return;

    const toastTimer = window.setTimeout(
      () => {
        setProjectTagToastState(projectTagToastState === "visible" ? "fading" : "hidden");
      },
      projectTagToastState === "visible" ? 4000 : 300,
    );

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [projectTagToastState]);

  useEffect(() => {
    if (openedProjectMenuId === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest("[data-project-menu]")) {
        return;
      }

      setOpenedProjectMenuId(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openedProjectMenuId]);

  const openProjectSheet = () => {
    setProjectSheetMode("create");
    setProjectSheetStep("tag");
    setEditingProjectId(null);
    setSelectedProjectTag(null);
    setProjectTitle("");
    setProjectTasks([]);
    setIsProjectTagEditing(false);
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
    setIsProjectSheetOpen(true);
  };

  const closeProjectMenu = () => {
    setOpenedProjectMenuId(null);
  };

  const openProjectEditSheet = (project: AddedProject, step: ProjectSheetStep) => {
    setProjectSheetMode("edit");
    setEditingProjectId(project.id);
    setProjectSheetStep(step);
    setSelectedProjectTag(project.label);
    setProjectTitle(project.title);
    setProjectTasks(project.tasks);
    setIsAddingProjectTag(false);
    setIsProjectTagEditing(false);
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
    closeProjectMenu();
    setIsProjectSheetOpen(true);
  };

  const closeProjectSheet = () => {
    setIsAddingProjectTag(false);
    setIsProjectTagEditing(false);
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
    setIsProjectExitModalOpen(false);
    setIsProjectSheetOpen(false);
  };

  const requestCloseProjectSheet = () => {
    if (projectSheetMode === "create") {
      setIsProjectExitModalOpen(true);
      return;
    }

    closeProjectSheet();
  };

  const commitNewProjectTag = async (value: string) => {
    const trimmedTag = value.trim();

    if (trimmedTag.length === 0) {
      setIsAddingProjectTag(false);
      return;
    }

    if (projectTags.includes(trimmedTag)) {
      setSelectedProjectTag(trimmedTag);
      setIsAddingProjectTag(false);
      return;
    }

    try {
      const createdProject = await createProjectMutation.mutateAsync({ name: trimmedTag });
      if (!createdProject?.projectId || !createdProject.name) return;

      const createdProjectId = createdProject.projectId;
      setCreatedProjectTagIds(currentIds =>
        currentIds.includes(createdProjectId) ? currentIds : [...currentIds, createdProjectId],
      );
      setSelectedProjectTag(createdProject.name);
      setIsAddingProjectTag(false);
    } catch {
      showProjectTagToast("프로젝트 태그를 추가하지 못했어요");
    }
  };

  const startProjectTagEdit = (projectTag: string) => {
    setEditingProjectTag(projectTag);
    setEditingProjectTagValue(projectTag);
  };

  const cancelProjectTagEdit = () => {
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
  };

  const confirmProjectTagEdit = async () => {
    if (!editingProjectTag) return;

    const trimmedTag = editingProjectTagValue.trim();

    if (trimmedTag.length === 0 || trimmedTag === editingProjectTag) {
      cancelProjectTagEdit();
      return;
    }

    if (projectTags.includes(trimmedTag)) {
      cancelProjectTagEdit();
      return;
    }

    const projectTag = projectTagItems.find(projectTag => projectTag.name === editingProjectTag);
    if (!projectTag) return;

    try {
      await updateProjectMutation.mutateAsync({ projectId: projectTag.id, name: trimmedTag });
      setAddedProjects(currentProjects =>
        currentProjects.map(project =>
          project.projectId === projectTag.id ? { ...project, label: trimmedTag } : project,
        ),
      );
      setSelectedProjectTag(currentTag =>
        currentTag === editingProjectTag ? trimmedTag : currentTag,
      );
      showProjectTagToast("프로젝트 태그명이 변경되었어요");
      cancelProjectTagEdit();
    } catch {
      showProjectTagToast("프로젝트 태그명을 변경하지 못했어요");
    }
  };

  const deleteProjectTag = async (projectTag: string) => {
    const targetProjectTag = projectTagItems.find(currentTag => currentTag.name === projectTag);
    if (!targetProjectTag) return;

    try {
      await deleteProjectMutation.mutateAsync(targetProjectTag.id);
      setCreatedProjectTagIds(currentIds =>
        currentIds.filter(currentId => currentId !== targetProjectTag.id),
      );
      setSelectedProjectTag(currentTag => (currentTag === projectTag ? null : currentTag));
      setAddedProjects(currentProjects =>
        currentProjects.filter(project => project.projectId !== targetProjectTag.id),
      );
      showProjectTagToast("프로젝트 태그가 삭제되었어요");
    } catch {
      showProjectTagToast("프로젝트 태그를 삭제하지 못했어요");
    }

    if (editingProjectTag === projectTag) {
      cancelProjectTagEdit();
    }
  };

  const toggleProjectMenu = (projectId: number) => {
    setOpenedProjectMenuId(currentId => (currentId === projectId ? null : projectId));
  };

  const deleteProject = (projectId: number) => {
    setAddedProjects(currentProjects =>
      currentProjects.filter(currentProject => currentProject.id !== projectId),
    );
    closeProjectMenu();
  };

  const toggleSelectedProjectTag = (projectTag: string) => {
    setSelectedProjectTag(currentTag => (currentTag === projectTag ? null : projectTag));
  };

  const startAddingProjectTag = () => {
    if (isAddingProjectTag) return;

    cancelProjectTagEdit();
    setSelectedProjectTag(null);
    setIsAddingProjectTag(true);
  };

  const handleProjectSheetHeaderTextClick = () => {
    if (isProjectTagEditing) {
      confirmProjectTagEdit();
      setIsProjectTagEditing(false);
      return;
    }

    if (createdProjectTags.length > 0) {
      setIsProjectTagEditing(true);
      setIsAddingProjectTag(false);
    }
  };

  const handleProjectPrevious = () => {
    if (projectSheetStep === "task") {
      setProjectSheetStep("title");
      return;
    }

    if (projectSheetStep === "title") {
      setProjectSheetStep("tag");
      return;
    }

    requestCloseProjectSheet();
  };

  const handleProjectNext = () => {
    const normalizedProjectTasks = normalizeTasks(projectTasks);

    if (projectSheetMode === "edit") {
      const editingProject =
        editingProjectId === null
          ? null
          : (addedProjects.find(project => project.id === editingProjectId) ?? null);

      if (!editingProject) return;

      const hasProjectEditChanges =
        (projectSheetStep === "tag" &&
          selectedProjectTag !== null &&
          selectedProjectTag !== editingProject.label) ||
        (projectSheetStep === "title" &&
          projectTitle.trim().length > 0 &&
          projectTitle.trim() !== editingProject.title) ||
        (projectSheetStep === "task" &&
          normalizedProjectTasks.length > 0 &&
          normalizedProjectTasks.length <= maxProjectTasks &&
          !areTasksEqual(projectTasks, editingProject.tasks));

      if (!hasProjectEditChanges) {
        return;
      }

      setAddedProjects(currentProjects =>
        currentProjects.map(project => {
          if (project.id !== editingProject.id) return project;

          if (projectSheetStep === "tag") {
            return { ...project, label: selectedProjectTag ?? project.label };
          }

          if (projectSheetStep === "title") {
            return { ...project, title: projectTitle.trim() };
          }

          if (normalizedProjectTasks.length > maxProjectTasks) return project;

          return {
            ...project,
            tasks: normalizedProjectTasks,
            scrumIds: alignScrumIds(project.scrumIds, normalizedProjectTasks.length),
          };
        }),
      );
      closeProjectSheet();
      return;
    }

    if (projectSheetStep === "tag") {
      if (!selectedProjectTag) {
        return;
      }

      setProjectSheetStep("title");
      return;
    }

    if (projectSheetStep === "title") {
      if (projectTitle.trim().length === 0) {
        return;
      }

      setProjectSheetStep("task");
      return;
    }

    if (normalizedProjectTasks.length === 0 || normalizedProjectTasks.length > maxProjectTasks) {
      return;
    }

    const selectedProjectId =
      projectTagItems.find(projectTag => projectTag.name === selectedProjectTag)?.id ?? null;
    if (!selectedProjectId) return;

    setAddedProjects(currentProjects => [
      ...currentProjects,
      {
        id: Date.now(),
        projectId: selectedProjectId,
        label: selectedProjectTag ?? "",
        title: projectTitle.trim(),
        tasks: normalizedProjectTasks,
      },
    ]);
    setSelectedProjectTag(null);
    setProjectTitle("");
    setProjectTasks([]);
    setProjectSheetStep("tag");
    closeProjectMenu();
    closeProjectSheet();
  };

  const getIsProjectActionEnabled = () => {
    const normalizedProjectTasks = normalizeTasks(projectTasks);
    if (projectSheetMode === "edit") {
      const editingProject =
        editingProjectId === null
          ? null
          : (addedProjects.find(project => project.id === editingProjectId) ?? null);
      if (!editingProject) return false;

      return (
        (projectSheetStep === "tag" &&
          selectedProjectTag !== null &&
          selectedProjectTag !== editingProject.label) ||
        (projectSheetStep === "title" &&
          projectTitle.trim().length > 0 &&
          projectTitle.trim() !== editingProject.title) ||
        (projectSheetStep === "task" &&
          normalizedProjectTasks.length > 0 &&
          normalizedProjectTasks.length <= maxProjectTasks &&
          !areTasksEqual(projectTasks, editingProject.tasks))
      );
    }

    return (
      isProjectStepReady(projectSheetStep, selectedProjectTag, projectTitle, projectTasks) &&
      (projectSheetStep !== "task" ||
        (normalizedProjectTasks.length > 0 && normalizedProjectTasks.length <= maxProjectTasks))
    );
  };

  return {
    isProjectSheetOpen,
    projectSheetMode,
    projectSheetStep,
    selectedProjectTag,
    projectTagItems,
    projectTags,
    createdProjectTags,
    isProjectTagEditing,
    editingProjectTag,
    editingProjectTagValue,
    isAddingProjectTag,
    projectTitle,
    projectTasks,
    openedProjectMenuId,
    projectTagToastState,
    projectTagToastMessage,
    isProjectExitModalOpen,
    canAddProject,
    maxProjectTasks,
    totalTaskCount,
    projectTitlePlaceholder,
    projectTaskPlaceholder,
    showProjectTagToast,
    getIsProjectActionEnabled,
    setEditingProjectTagValue,
    setProjectTitle,
    setProjectTasks,
    setIsAddingProjectTag,
    setIsProjectExitModalOpen,
    openProjectSheet,
    openProjectEditSheet,
    closeProjectSheet,
    requestCloseProjectSheet,
    closeProjectMenu,
    commitNewProjectTag,
    startProjectTagEdit,
    cancelProjectTagEdit,
    confirmProjectTagEdit,
    deleteProjectTag,
    toggleProjectMenu,
    deleteProject,
    toggleSelectedProjectTag,
    startAddingProjectTag,
    handleProjectSheetHeaderTextClick,
    handleProjectPrevious,
    handleProjectNext,
  };
};
