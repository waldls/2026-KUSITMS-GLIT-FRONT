"use client";

import { CancelIcon, PlusIcon } from "@/assets/icons";
import BottomSheet from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import Chip from "@/components/common/Chip";
import TextField from "@/components/common/TextField";
import ScrumTextArea from "@/components/record/ScrumTextArea";
import { cn } from "@/lib/utils/cn";

type ProjectSheetMode = "create" | "edit";
type ProjectSheetStep = "tag" | "title" | "task";

interface ProjectSheetProps {
  isOpen: boolean;
  mode: ProjectSheetMode;
  step: ProjectSheetStep;
  selectedProjectTag: string | null;
  projectTags: string[];
  createdProjectTags: string[];
  isProjectTagEditing: boolean;
  editingProjectTag: string | null;
  editingProjectTagValue: string;
  isAddingProjectTag: boolean;
  projectTitle: string;
  projectTasks: string[];
  projectTitlePlaceholder: string;
  projectTaskPlaceholder: string;
  canEditProjectTags: boolean;
  isProjectActionEnabled: boolean;
  maxProjectTasks: number;
  onClose: () => void;
  onOverlayClick: () => void;
  onHeaderTextClick: () => void;
  onSelectProjectTag: (projectTag: string) => void;
  onStartProjectTagEdit: (projectTag: string) => void;
  onCancelProjectTagEdit: () => void;
  onChangeEditingProjectTagValue: (value: string) => void;
  onConfirmProjectTagEdit: () => void;
  onDeleteProjectTag: (projectTag: string) => void;
  onStartAddingProjectTag: () => void;
  onCancelAddingProjectTag: () => void;
  onCommitNewProjectTag: (value: string) => void;
  onChangeProjectTitle: (value: string) => void;
  onClearProjectTitle: () => void;
  onChangeProjectTasks: (tasks: string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ProjectSheet = ({
  isOpen,
  mode,
  step,
  selectedProjectTag,
  projectTags,
  createdProjectTags,
  isProjectTagEditing,
  editingProjectTag,
  editingProjectTagValue,
  isAddingProjectTag,
  projectTitle,
  projectTasks,
  projectTitlePlaceholder,
  projectTaskPlaceholder,
  canEditProjectTags,
  isProjectActionEnabled,
  maxProjectTasks,
  onClose,
  onOverlayClick,
  onHeaderTextClick,
  onSelectProjectTag,
  onStartProjectTagEdit,
  onCancelProjectTagEdit,
  onChangeEditingProjectTagValue,
  onConfirmProjectTagEdit,
  onDeleteProjectTag,
  onStartAddingProjectTag,
  onCancelAddingProjectTag,
  onCommitNewProjectTag,
  onChangeProjectTitle,
  onClearProjectTitle,
  onChangeProjectTasks,
  onPrevious,
  onNext,
}: ProjectSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      height="55vh"
      hideScrollbar
      text={step === "tag" ? (isProjectTagEditing ? "완료" : "편집") : undefined}
      onTextClick={onHeaderTextClick}
      textClassName={cn(
        "body-3",
        isProjectTagEditing
          ? "text-sea-blue-500"
          : canEditProjectTags
            ? "text-gray-400"
            : "text-gray-600",
      )}>
      <div className="flex min-h-full flex-col px-5 pt-3 pb-7">
        <div
          className={cn(
            step === "tag" && "mb-6",
            step === "title" && "mb-14",
            step === "task" && "mb-3",
          )}>
          <h2 className="head-5 text-white">
            {step === "tag"
              ? isProjectTagEditing
                ? "프로젝트 태그 수정"
                : "프로젝트 태그 선택"
              : step === "title"
                ? "제목"
                : "작업"}
          </h2>
          <p className="body-5 text-gray-400">
            {step === "tag"
              ? isProjectTagEditing
                ? "새로 생성한 프로젝트 태그만 수정할 수 있어요"
                : "최대 1개만 선택할 수 있어요"
              : step === "title"
                ? "이 프로젝트에서 한 작업들의 제목을 적어요"
                : "작업 당 최대 50자까지 적을 수 있어요"}
          </p>
        </div>

        {step === "tag" && isProjectTagEditing ? (
          <div className="flex flex-wrap gap-3">
            {projectTags.map(projectTag => {
              const isCreatedTag = createdProjectTags.includes(projectTag);
              const isEditingTag = editingProjectTag === projectTag;

              if (isCreatedTag && isEditingTag) {
                return (
                  <label
                    key={projectTag}
                    className="body-5 rounded-6 border-sea-blue-400 inline-flex w-fit items-center border-[0.6px] bg-gray-800 px-2 py-2.5 text-white">
                    <span className="flex items-center gap-0.75 px-px">
                      <button
                        type="button"
                        aria-label={`${projectTag} 수정 취소`}
                        onMouseDown={event => event.preventDefault()}
                        onClick={onCancelProjectTagEdit}
                        className="flex size-4 shrink-0 cursor-pointer items-center justify-center">
                        <CancelIcon className="size-4" />
                      </button>
                      <span className="relative inline-block min-w-4">
                        <span aria-hidden="true" className="body-5 invisible whitespace-pre">
                          {editingProjectTagValue || " "}
                        </span>
                        <input
                          value={editingProjectTagValue}
                          maxLength={15}
                          onChange={event => onChangeEditingProjectTagValue(event.target.value)}
                          onKeyDown={event => {
                            if (event.nativeEvent.isComposing) return;

                            if (event.key === "Enter") {
                              event.preventDefault();
                              onConfirmProjectTagEdit();
                            }

                            if (event.key === "Escape") {
                              event.preventDefault();
                              onCancelProjectTagEdit();
                            }
                          }}
                          className="body-5 absolute inset-0 h-full w-full bg-transparent text-white caret-white outline-none"
                        />
                      </span>
                    </span>
                  </label>
                );
              }

              return (
                <Chip
                  key={projectTag}
                  state={isCreatedTag ? "default" : "unselected"}
                  leftIcon={
                    isCreatedTag ? (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`${projectTag} 삭제`}
                        onClick={event => {
                          event.stopPropagation();
                          onDeleteProjectTag(projectTag);
                        }}
                        className="flex size-4 shrink-0 cursor-pointer items-center justify-center">
                        <CancelIcon className="size-4" />
                      </span>
                    ) : undefined
                  }
                  onClick={() => {
                    if (isCreatedTag) {
                      onStartProjectTagEdit(projectTag);
                    }
                  }}
                  disabled={!isCreatedTag}
                  className={cn(
                    "border border-transparent",
                    isCreatedTag ? "bg-gray-800 opacity-100" : "cursor-default opacity-30",
                  )}>
                  {projectTag}
                </Chip>
              );
            })}
            {isAddingProjectTag && (
              <Chip
                state="input"
                confirmOnBlur
                onConfirm={onCommitNewProjectTag}
                onCancel={onCancelAddingProjectTag}
                maxLength={15}
                className="border-sea-blue-400 bg-gray-800"
                inputClassName="min-w-2"
              />
            )}
            <Chip
              leftIcon={<PlusIcon />}
              state="default"
              onClick={onStartAddingProjectTag}
              disabled={isAddingProjectTag}
              className="!disabled:cursor-not-allowed border border-transparent bg-gray-900">
              추가
            </Chip>
          </div>
        ) : step === "tag" ? (
          <div className="flex flex-wrap gap-3">
            {projectTags.map(projectTag => (
              <Chip
                key={projectTag}
                state={selectedProjectTag === projectTag ? "selected" : "unselected"}
                onClick={() => onSelectProjectTag(projectTag)}
                className={cn(
                  "border",
                  selectedProjectTag === projectTag ? "border-sea-blue-400" : "border-transparent",
                  !selectedProjectTag && "opacity-100",
                )}>
                {projectTag}
              </Chip>
            ))}
            {isAddingProjectTag && (
              <Chip
                state="input"
                confirmOnBlur
                onConfirm={onCommitNewProjectTag}
                onCancel={onCancelAddingProjectTag}
                maxLength={15}
                className="border-sea-blue-400 bg-gray-800"
                inputClassName="min-w-2"
              />
            )}
            <Chip
              leftIcon={<PlusIcon />}
              state="default"
              onClick={onStartAddingProjectTag}
              disabled={isAddingProjectTag}
              className="bg-gray-900 ring-0 disabled:cursor-not-allowed">
              추가
            </Chip>
          </div>
        ) : step === "title" ? (
          <TextField
            value={projectTitle}
            onChange={event => onChangeProjectTitle(event.target.value)}
            placeholder={`ex. ${projectTitlePlaceholder}`}
            maxLength={20}
            showCount
            rightIcon={<CancelIcon />}
            onRightIconClick={onClearProjectTitle}
            rightIconClassName={cn("text-gray-100", projectTitle.length === 0 && "text-gray-800")}
            wrapperClassName="border-gray-800 has-[input:not(:placeholder-shown):focus]:border-gray-800 has-[input:not(:placeholder-shown):not(:focus)]:border-gray-800"
            className="body-2 text-gray-200 placeholder:text-gray-800 focus:text-gray-200"
          />
        ) : (
          <ScrumTextArea
            value={projectTasks}
            onChange={onChangeProjectTasks}
            maxItems={maxProjectTasks}
            placeholder={projectTaskPlaceholder}
          />
        )}

        <div
          className={cn(
            "mt-auto grid gap-1.5",
            mode === "create" && step !== "tag" ? "grid-cols-2" : "grid-cols-1",
          )}>
          {mode === "create" && step !== "tag" && (
            <Button
              size="lg"
              variant="gray"
              onClick={onPrevious}
              className="text-offwhite-500 w-full bg-gray-400/40">
              이전
            </Button>
          )}
          {!isProjectTagEditing && (
            <Button
              size="lg"
              data-testid="project-sheet-next-button"
              disabled={!isProjectActionEnabled}
              onClick={onNext}
              className={cn(
                "w-full",
                isProjectActionEnabled
                  ? "w-full bg-white text-gray-900 active:bg-white"
                  : "text-offwhite-500 bg-gray-400/40",
              )}>
              {mode === "edit" || step === "task" ? "완료" : "다음"}
            </Button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

export default ProjectSheet;
