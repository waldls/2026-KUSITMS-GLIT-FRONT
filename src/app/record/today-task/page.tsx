"use client";

import { MyPageIcon } from "@/assets/icons";
import Modal from "@/components/common/Modal";
import Toast from "@/components/common/Toast";
import CalendarSheet from "@/containers/record/today-task/CalendarSheet";
import DateSection from "@/containers/record/today-task/DateSection";
import ProjectSection from "@/containers/record/today-task/ProjectSection";
import ProjectSheet from "@/containers/record/today-task/ProjectSheet";
import { useDailyScrum } from "@/lib/hooks/record/useDailyScrum";
import { cn } from "@/lib/utils/cn";

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

const Page = () => {
  const {
    selectedDate,
    isDateFieldSelected,
    calendarDraftDate,
    isCalendarOpen,
    isProjectSheetOpen,
    projectSheetMode,
    projectSheetStep,
    selectedProjectTag,
    projectTags,
    createdProjectTags,
    isProjectTagEditing,
    editingProjectTag,
    editingProjectTagValue,
    isAddingProjectTag,
    projectTitle,
    projectTasks,
    addedProjects,
    openedProjectMenuId,
    scrumToastState,
    scrumToastMessage,
    projectTagToastState,
    projectTagToastMessage,
    isProjectExitModalOpen,
    canAddProject,
    maxProjectTasks,
    projectTitlePlaceholder,
    projectTaskPlaceholder,
    getIsProjectActionEnabled,
    setCalendarDraftDate,
    setEditingProjectTagValue,
    setProjectTitle,
    setProjectTasks,
    setIsAddingProjectTag,
    setIsProjectExitModalOpen,
    openProjectSheet,
    openProjectEditSheet,
    openCalendarSheet,
    loadCalendarScrumDates,
    isScrumDate,
    isStarDate,
    handleCalendarDateClick,
    closeCalendarSheet,
    confirmCalendarDate,
    closeProjectSheet,
    requestCloseProjectSheet,
    toggleProjectMenu,
    deleteProject,
    toggleSelectedProjectTag,
    startAddingProjectTag,
    commitNewProjectTag,
    startProjectTagEdit,
    cancelProjectTagEdit,
    confirmProjectTagEdit,
    deleteProjectTag,
    handleProjectSheetHeaderTextClick,
    handleProjectPrevious,
    handleProjectNext,
  } = useDailyScrum();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Toast
        contents="프로젝트 수 상관없이 총 5개의 작업만 작성 가능해요"
        leftIcon={<MyPageIcon className="text-offwhite-600 size-6" />}
        showCloseButton={false}
        className="bg-gray-850/60 mt-4 w-full p-3"
      />

      {scrumToastState !== "hidden" && (
        <Toast
          contents={scrumToastMessage}
          showCloseButton={false}
          className={cn(
            "fixed bottom-9.5 left-1/2 z-60 -translate-x-1/2 justify-center transition-opacity duration-300",
            scrumToastState === "fading" ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      {projectTagToastState !== "hidden" && (
        <Toast
          contents={projectTagToastMessage}
          variant="success"
          showCloseButton={false}
          className={cn(
            "fixed bottom-9.5 left-1/2 z-60 -translate-x-1/2 justify-center transition-opacity duration-300",
            projectTagToastState === "fading" ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      <DateSection
        value={selectedDate ? formatDate(selectedDate) : ""}
        placeholder={formatDate(new Date())}
        selected={isDateFieldSelected}
        onOpenCalendar={openCalendarSheet}
      />

      <ProjectSection
        projects={addedProjects}
        canAddProject={canAddProject}
        openedProjectMenuId={openedProjectMenuId}
        onOpenProjectSheet={openProjectSheet}
        onToggleProjectMenu={toggleProjectMenu}
        onDeleteProject={deleteProject}
        onOpenProjectEditSheet={openProjectEditSheet}
      />

      <CalendarSheet
        isOpen={isCalendarOpen}
        selectedDate={calendarDraftDate}
        isScrumDate={isScrumDate}
        isStarDate={isStarDate}
        doneEnabled={calendarDraftDate !== null}
        onClose={closeCalendarSheet}
        onConfirm={confirmCalendarDate}
        onSelectDate={setCalendarDraftDate}
        onMonthChange={loadCalendarScrumDates}
        onCalendarDayClick={handleCalendarDateClick}
      />

      <ProjectSheet
        isOpen={isProjectSheetOpen}
        mode={projectSheetMode}
        step={projectSheetStep}
        selectedProjectTag={selectedProjectTag}
        projectTags={projectTags}
        createdProjectTags={createdProjectTags}
        isProjectTagEditing={isProjectTagEditing}
        editingProjectTag={editingProjectTag}
        editingProjectTagValue={editingProjectTagValue}
        isAddingProjectTag={isAddingProjectTag}
        projectTitle={projectTitle}
        projectTasks={projectTasks}
        projectTitlePlaceholder={projectTitlePlaceholder}
        projectTaskPlaceholder={projectTaskPlaceholder}
        canEditProjectTags={createdProjectTags.length > 0}
        isProjectActionEnabled={getIsProjectActionEnabled()}
        maxProjectTasks={maxProjectTasks}
        onClose={requestCloseProjectSheet}
        onOverlayClick={closeProjectSheet}
        onHeaderTextClick={handleProjectSheetHeaderTextClick}
        onSelectProjectTag={toggleSelectedProjectTag}
        onStartProjectTagEdit={startProjectTagEdit}
        onCancelProjectTagEdit={cancelProjectTagEdit}
        onChangeEditingProjectTagValue={setEditingProjectTagValue}
        onConfirmProjectTagEdit={confirmProjectTagEdit}
        onDeleteProjectTag={deleteProjectTag}
        onStartAddingProjectTag={startAddingProjectTag}
        onCancelAddingProjectTag={() => setIsAddingProjectTag(false)}
        onCommitNewProjectTag={commitNewProjectTag}
        onChangeProjectTitle={setProjectTitle}
        onClearProjectTitle={() => setProjectTitle("")}
        onChangeProjectTasks={setProjectTasks}
        onPrevious={handleProjectPrevious}
        onNext={handleProjectNext}
      />

      {isProjectExitModalOpen && (
        <div className="fixed inset-y-0 left-1/2 z-70 w-full max-w-107.5 min-w-93.75 -translate-x-1/2">
          <Modal
            isOpen={isProjectExitModalOpen}
            type="double"
            title="정말 그만두시겠어요?"
            contents="지금 나가면 작성 중인 내용이 없어져요"
            btnLLabel="나가기"
            btnRLabel="머무르기"
            onBtnLClick={closeProjectSheet}
            onBtnRClick={() => setIsProjectExitModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
