import { useEffect, useState } from "react";

import { useDailyScrumCalendar } from "@/lib/hooks/record/useDailyScrumCalendar";
import { useDailyScrumDraft } from "@/lib/hooks/record/useDailyScrumDraft";
import {
  type ScrumToastState,
  useDailyScrumProjectSheet,
} from "@/lib/hooks/record/useDailyScrumProjectSheet";
import { parseApiDate } from "@/lib/utils/calendar";
import { useRecordDraftStore } from "@/store/recordDraftStore";

export type { AddedProject } from "@/store/recordDraftStore";

const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const useDailyScrum = () => {
  const [isDateFieldSelected, setIsDateFieldSelected] = useState(false);
  const [scrumToastState, setScrumToastState] = useState<ScrumToastState>("hidden");
  const [scrumToastMessage, setScrumToastMessage] = useState("");
  const setDraft = useRecordDraftStore(state => state.setDraft);
  const selectedDateStr = useRecordDraftStore(state => state.selectedDate);
  const isTodayWithExistingRecord = useRecordDraftStore(state => state.isTodayWithExistingRecord);

  const showScrumToast = (message: string) => {
    setScrumToastMessage(message);
    setScrumToastState("visible");
  };

  const calendarSelectedDate = selectedDateStr ? parseApiDate(selectedDateStr) : getToday();

  useEffect(() => {
    if (scrumToastState === "hidden") return;

    const toastTimer = window.setTimeout(
      () => {
        setScrumToastState(scrumToastState === "visible" ? "fading" : "hidden");
      },
      scrumToastState === "visible" ? 1700 : 300,
    );

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [scrumToastState]);

  const projectSheet = useDailyScrumProjectSheet();

  const calendar = useDailyScrumCalendar({
    selectedDate: isDateFieldSelected ? calendarSelectedDate : null,
    onConfirmDate: date => {
      setDraft({ selectedDate: formatDateForApi(date) });
      setIsDateFieldSelected(true);
    },
    showScrumToast,
  });

  const draft = useDailyScrumDraft({
    projectTagItems: projectSheet.projectTagItems,
    selectedProjectTag: projectSheet.selectedProjectTag,
    projectTitle: projectSheet.projectTitle,
    projectTasks: projectSheet.projectTasks,
    totalTaskCount: projectSheet.totalTaskCount,
    showProjectTagToast: projectSheet.showProjectTagToast,
    showScrumToast,
    isStarDate: calendar.isStarDate,
  });

  return {
    selectedDate: draft.selectedDate,
    isDateFieldSelected,
    isTodayWithExistingRecord,
    addedProjects: draft.addedProjects,
    scrumToastState,
    scrumToastMessage,
    isSaving: draft.isSaving,
    setScrumToastState,
    calendarDraftDate: calendar.calendarDraftDate,
    calendarStarDates: calendar.calendarStarDates,
    isCalendarOpen: calendar.isCalendarOpen,
    setCalendarDraftDate: calendar.setCalendarDraftDate,
    openCalendarSheet: calendar.openCalendarSheet,
    loadCalendarScrumDates: calendar.loadCalendarScrumDates,
    isScrumDate: calendar.isScrumDate,
    isStarDate: calendar.isStarDate,
    isRecordDateLocked: calendar.isRecordDateLocked,
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
    showProjectAddButton: projectSheet.showProjectAddButton,
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
