import { useDailyScrumCalendar } from "@/lib/hooks/record/useDailyScrumCalendar";
import { useDailyScrumDraft } from "@/lib/hooks/record/useDailyScrumDraft";
import { useDailyScrumProjectSheet } from "@/lib/hooks/record/useDailyScrumProjectSheet";

export type { AddedProject } from "@/store/recordDraftStore";

export const useDailyScrum = () => {
  const projectSheet = useDailyScrumProjectSheet();
  const draft = useDailyScrumDraft({
    projectTagItems: projectSheet.projectTagItems,
    selectedProjectTag: projectSheet.selectedProjectTag,
    projectTitle: projectSheet.projectTitle,
    projectTasks: projectSheet.projectTasks,
    totalTaskCount: projectSheet.totalTaskCount,
    showProjectTagToast: projectSheet.showProjectTagToast,
  });
  const calendar = useDailyScrumCalendar({
    selectedDate: draft.selectedDate,
    onConfirmDate: date => {
      draft.setSelectedDate(date);
    },
    showScrumToast: draft.showScrumToast,
  });

  return {
    selectedDate: draft.selectedDate,
    addedProjects: draft.addedProjects,
    scrumToastState: draft.scrumToastState,
    scrumToastMessage: draft.scrumToastMessage,
    isSaving: draft.isSaving,
    setScrumToastState: draft.setScrumToastState,
    calendarDraftDate: calendar.calendarDraftDate,
    calendarStarDates: calendar.calendarStarDates,
    isCalendarOpen: calendar.isCalendarOpen,
    setCalendarDraftDate: calendar.setCalendarDraftDate,
    openCalendarSheet: calendar.openCalendarSheet,
    loadCalendarScrumDates: calendar.loadCalendarScrumDates,
    isScrumDate: calendar.isScrumDate,
    isStarDate: calendar.isStarDate,
    handleCalendarDateClick: calendar.handleCalendarDateClick,
    closeCalendarSheet: calendar.closeCalendarSheet,
    confirmCalendarDate: calendar.confirmCalendarDate,
    isProjectSheetOpen: projectSheet.isProjectSheetOpen,
    projectSheetMode: projectSheet.projectSheetMode,
    projectSheetStep: projectSheet.projectSheetStep,
    selectedProjectTag: projectSheet.selectedProjectTag,
    projectTags: projectSheet.projectTags,
    createdProjectTags: projectSheet.createdProjectTags,
    isProjectTagEditing: projectSheet.isProjectTagEditing,
    editingProjectTag: projectSheet.editingProjectTag,
    editingProjectTagValue: projectSheet.editingProjectTagValue,
    isAddingProjectTag: projectSheet.isAddingProjectTag,
    projectTitle: projectSheet.projectTitle,
    projectTasks: projectSheet.projectTasks,
    openedProjectMenuId: projectSheet.openedProjectMenuId,
    projectTagToastState: projectSheet.projectTagToastState,
    projectTagToastMessage: projectSheet.projectTagToastMessage,
    isProjectExitModalOpen: projectSheet.isProjectExitModalOpen,
    canAddProject: projectSheet.canAddProject,
    maxProjectTasks: projectSheet.maxProjectTasks,
    projectTitlePlaceholder: projectSheet.projectTitlePlaceholder,
    projectTaskPlaceholder: projectSheet.projectTaskPlaceholder,
    getIsProjectActionEnabled: projectSheet.getIsProjectActionEnabled,
    setEditingProjectTagValue: projectSheet.setEditingProjectTagValue,
    setProjectTitle: projectSheet.setProjectTitle,
    setProjectTasks: projectSheet.setProjectTasks,
    setIsAddingProjectTag: projectSheet.setIsAddingProjectTag,
    setIsProjectExitModalOpen: projectSheet.setIsProjectExitModalOpen,
    openProjectSheet: projectSheet.openProjectSheet,
    openProjectEditSheet: projectSheet.openProjectEditSheet,
    closeProjectSheet: projectSheet.closeProjectSheet,
    requestCloseProjectSheet: projectSheet.requestCloseProjectSheet,
    closeProjectMenu: projectSheet.closeProjectMenu,
    commitNewProjectTag: projectSheet.commitNewProjectTag,
    startProjectTagEdit: projectSheet.startProjectTagEdit,
    cancelProjectTagEdit: projectSheet.cancelProjectTagEdit,
    confirmProjectTagEdit: projectSheet.confirmProjectTagEdit,
    deleteProjectTag: projectSheet.deleteProjectTag,
    toggleProjectMenu: projectSheet.toggleProjectMenu,
    deleteProject: projectSheet.deleteProject,
    toggleSelectedProjectTag: projectSheet.toggleSelectedProjectTag,
    startAddingProjectTag: projectSheet.startAddingProjectTag,
    handleProjectSheetHeaderTextClick: projectSheet.handleProjectSheetHeaderTextClick,
    handleProjectPrevious: projectSheet.handleProjectPrevious,
    handleProjectNext: projectSheet.handleProjectNext,
  };
};
