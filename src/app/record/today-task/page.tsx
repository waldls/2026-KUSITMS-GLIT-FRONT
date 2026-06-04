"use client";

import dynamic from "next/dynamic";

import { MyPageIcon } from "@/assets/icons";
import Modal from "@/components/common/Modal";
import Toast from "@/components/common/Toast";
import DateSection from "@/containers/record/today-task/DateSection";
import ProjectSection from "@/containers/record/today-task/ProjectSection";
import { useDailyScrum } from "@/lib/hooks/record/useDailyScrum";
import { cn } from "@/lib/utils/cn";

const CalendarSheet = dynamic(() => import("@/containers/record/today-task/CalendarSheet"));
const ProjectSheet = dynamic(() => import("@/containers/record/today-task/ProjectSheet"));

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

const Page = () => {
  const { toast, date, calendar, projectSheet } = useDailyScrum();

  return (
    <div className="flex flex-col">
      <Toast
        contents="프로젝트 수 상관없이 총 5개의 작업만 작성 가능해요"
        leftIcon={<MyPageIcon className="text-offwhite-600 size-6" />}
        showCloseButton={false}
        className="bg-gray-850/60 mt-4 w-full p-3"
      />

      {toast.scrumToastState !== "hidden" && (
        <Toast
          contents={toast.scrumToastMessage}
          showCloseButton={false}
          className={cn(
            "fixed bottom-9.5 left-1/2 z-60 -translate-x-1/2 justify-center transition-opacity duration-300",
            toast.scrumToastState === "fading" ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      {projectSheet.projectTagToastState !== "hidden" && (
        <Toast
          contents={projectSheet.projectTagToastMessage}
          variant={
            projectSheet.projectTagToastMessage === "새로 추가한 태그만 수정할 수 있어요"
              ? "error"
              : "success"
          }
          showCloseButton={false}
          className={cn(
            "fixed bottom-9.5 left-1/2 z-60 -translate-x-1/2 justify-center transition-opacity duration-300",
            projectSheet.projectTagToastState === "fading" ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      <DateSection
        value={date.isDateFieldSelected && date.selectedDate ? formatDate(date.selectedDate) : ""}
        placeholder={formatDate(new Date())}
        selected={date.isDateFieldSelected}
        onOpenCalendar={calendar.openCalendarSheet}
      />

      <ProjectSection
        projects={date.addedProjects}
        canAddProject={projectSheet.canAddProject}
        showProjectAddButton={projectSheet.showProjectAddButton}
        isTodayWithExistingRecord={date.isTodayWithExistingRecord}
        openedProjectMenuId={projectSheet.openedProjectMenuId}
        onOpenProjectSheet={projectSheet.openProjectSheet}
        onToggleProjectMenu={projectSheet.toggleProjectMenu}
        onDeleteProject={projectSheet.deleteProject}
        onOpenProjectEditSheet={projectSheet.openProjectEditSheet}
      />

      <CalendarSheet
        isOpen={calendar.isCalendarOpen}
        selectedDate={calendar.calendarDraftDate}
        isScrumDate={calendar.isScrumDate}
        isRecordDateLocked={calendar.isRecordDateLocked}
        doneEnabled={calendar.calendarDraftDate !== null}
        onClose={calendar.closeCalendarSheet}
        onConfirm={calendar.confirmCalendarDate}
        onSelectDate={calendar.setCalendarDraftDate}
        onMonthChange={calendar.loadCalendarScrumDates}
        onCalendarDayClick={calendar.handleCalendarDateClick}
      />

      <ProjectSheet
        isOpen={projectSheet.isProjectSheetOpen}
        mode={projectSheet.projectSheetMode}
        step={projectSheet.projectSheetStep}
        selectedProjectTag={projectSheet.selectedProjectTag}
        projectTags={projectSheet.projectTags}
        createdProjectTags={projectSheet.createdProjectTags}
        isProjectTagEditing={projectSheet.isProjectTagEditing}
        editingProjectTag={projectSheet.editingProjectTag}
        editingProjectTagValue={projectSheet.editingProjectTagValue}
        isAddingProjectTag={projectSheet.isAddingProjectTag}
        projectTitle={projectSheet.projectTitle}
        projectTasks={projectSheet.projectTasks}
        projectTitlePlaceholder={projectSheet.projectTitlePlaceholder}
        projectTaskPlaceholder={projectSheet.projectTaskPlaceholder}
        canEditProjectTags={projectSheet.createdProjectTags.length > 0}
        isProjectActionEnabled={projectSheet.getIsProjectActionEnabled()}
        maxProjectTasks={projectSheet.maxProjectTasks}
        onClose={projectSheet.requestCloseProjectSheet}
        onOverlayClick={projectSheet.dismissProjectSheetOnOverlay}
        onHeaderTextClick={projectSheet.handleProjectSheetHeaderTextClick}
        onSelectProjectTag={projectSheet.toggleSelectedProjectTag}
        onStartProjectTagEdit={projectSheet.startProjectTagEdit}
        onCancelProjectTagEdit={projectSheet.cancelProjectTagEdit}
        onChangeEditingProjectTagValue={projectSheet.setEditingProjectTagValue}
        onConfirmProjectTagEdit={projectSheet.confirmProjectTagEdit}
        onDeleteProjectTag={projectSheet.deleteProjectTag}
        onStartAddingProjectTag={projectSheet.startAddingProjectTag}
        onCancelAddingProjectTag={() => projectSheet.setIsAddingProjectTag(false)}
        onCommitNewProjectTag={projectSheet.commitNewProjectTag}
        onChangeProjectTitle={projectSheet.setProjectTitle}
        onClearProjectTitle={() => projectSheet.setProjectTitle("")}
        onChangeProjectTasks={projectSheet.setProjectTasks}
        onPrevious={projectSheet.handleProjectPrevious}
        onNext={projectSheet.handleProjectNext}
      />

      {projectSheet.isProjectExitModalOpen && (
        <div className="fixed inset-y-0 left-1/2 z-70 w-full max-w-107.5 min-w-93.75 -translate-x-1/2">
          <Modal
            isOpen={projectSheet.isProjectExitModalOpen}
            type="double"
            title="정말 그만두시겠어요?"
            contents="지금 나가면 작성 중인 내용이 없어져요"
            btnLLabel="나가기"
            btnRLabel="머무르기"
            onBtnLClick={projectSheet.confirmAbandonProjectSheet}
            onBtnRClick={() => projectSheet.setIsProjectExitModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
