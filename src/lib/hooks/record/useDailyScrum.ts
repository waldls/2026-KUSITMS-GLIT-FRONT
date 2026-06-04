import { useEffect, useState } from "react";

import { useDailyScrumCalendar } from "@/lib/hooks/record/useDailyScrumCalendar";
import { useDailyScrumDraft } from "@/lib/hooks/record/useDailyScrumDraft";
import { useDailyScrumProjectSheet } from "@/lib/hooks/record/useDailyScrumProjectSheet";
import { parseApiDate } from "@/lib/utils/calendar";
import { useRecordDraftStore } from "@/store/recordDraftStore";

export type { AddedProject } from "@/store/recordDraftStore";

type ScrumToastState = "hidden" | "visible" | "fading";

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

  const calendarSelectedDate = selectedDateStr ? parseApiDate(selectedDateStr) : getToday();
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
    toast: {
      scrumToastState,
      scrumToastMessage,
      setScrumToastState,
    },
    date: {
      selectedDate: draft.selectedDate,
      isDateFieldSelected,
      isTodayWithExistingRecord,
      addedProjects: draft.addedProjects,
      isSaving: draft.isSaving,
    },
    calendar,
    projectSheet,
  };
};
