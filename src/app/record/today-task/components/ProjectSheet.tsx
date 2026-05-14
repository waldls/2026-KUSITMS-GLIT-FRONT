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
  canEditProjectTags: boolean;
  isProjectActionEnabled: boolean;
  maxProjectTasks: number;
  onClose: () => void;
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
  canEditProjectTags,
  isProjectActionEnabled,
  maxProjectTasks,
  onClose,
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
      text={step === "tag" ? (isProjectTagEditing ? "완료" : "편집") : undefined}
      onTextClick={onHeaderTextClick}
      textDisabled={step === "tag" && !isProjectTagEditing && !canEditProjectTags}
      textClassName={cn(
        "body-3",
        isProjectTagEditing
          ? "text-sea-blue-500"
          : canEditProjectTags
            ? "text-gray-400"
            : "text-gray-600",
      )}>
      <div className="flex min-h-92.5 flex-col px-5 pt-3 pb-7">
        <div
          className={cn(
            step === "tag" && "mb-6",
            step === "title" && "mb-14",
            step === "task" && "mb-3",
          )}>
          <h2 className="body-5 text-white">
            {step === "tag"
              ? isProjectTagEditing
                ? "프로젝트 태그 수정"
                : "프로젝트 태그 선택"
              : step === "title"
                ? "제목"
                : "작업"}
          </h2>
          <p className="body-4 text-gray-400">
            {step === "tag"
              ? "최대 1개만 선택할 수 있어요"
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
                    className="body-4 rounded-6 border-sea-blue-400 inline-flex w-fit items-center border-[0.6px] bg-gray-800 px-2 py-2.5 text-white">
                    <span className="flex items-center gap-0.75 px-px">
                      <button
                        type="button"
                        aria-label={`${projectTag} 수정 취소`}
                        onMouseDown={event => event.preventDefault()}
                        onClick={onCancelProjectTagEdit}
                        className="flex size-4 shrink-0 cursor-pointer items-center justify-center">
                        <CancelIcon className="size-4" />
                      </button>
                      <input
                        autoFocus
                        value={editingProjectTagValue}
                        onChange={event => onChangeEditingProjectTagValue(event.target.value)}
                        onBlur={onConfirmProjectTagEdit}
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
                        className="body-4 [field-sizing:content] min-w-4 bg-transparent text-white caret-white outline-none"
                      />
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
                      <button
                        type="button"
                        aria-label={`${projectTag} 삭제`}
                        onClick={event => {
                          event.stopPropagation();
                          onDeleteProjectTag(projectTag);
                        }}
                        className="flex size-4 shrink-0 cursor-pointer items-center justify-center">
                        <CancelIcon className="size-4" />
                      </button>
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
            {isAddingProjectTag ? (
              <Chip
                state="input"
                leftIcon={<PlusIcon />}
                autoFocus
                confirmOnBlur
                onConfirm={onCommitNewProjectTag}
                onCancel={onCancelAddingProjectTag}
                className="border-sea-blue-400 bg-gray-800"
                inputClassName="min-w-2"
              />
            ) : (
              <Chip
                leftIcon={<PlusIcon />}
                state="default"
                onClick={onStartAddingProjectTag}
                className="border border-transparent bg-gray-900 opacity-100">
                추가
              </Chip>
            )}
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
            {isAddingProjectTag ? (
              <Chip
                state="input"
                leftIcon={<PlusIcon />}
                autoFocus
                confirmOnBlur
                onConfirm={onCommitNewProjectTag}
                onCancel={onCancelAddingProjectTag}
                className="border-sea-blue-400 bg-gray-800"
                inputClassName="min-w-2"
              />
            ) : (
              <Chip
                leftIcon={<PlusIcon />}
                state="default"
                onClick={onStartAddingProjectTag}
                className="border border-transparent bg-gray-900 opacity-100">
                추가
              </Chip>
            )}
          </div>
        ) : step === "title" ? (
          <TextField
            value={projectTitle}
            onChange={event => onChangeProjectTitle(event.target.value)}
            placeholder="ex. 6/6 기획 작업"
            maxLength={20}
            showCount
            rightIcon={<CancelIcon />}
            onRightIconClick={onClearProjectTitle}
            rightIconClassName={cn("text-gray-100", projectTitle.length === 0 && "text-gray-800")}
            className="body-2 text-gray-200 placeholder:text-gray-800"
          />
        ) : (
          <ScrumTextArea
            value={projectTasks}
            onChange={onChangeProjectTasks}
            maxItems={maxProjectTasks}
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
              disabled={!isProjectActionEnabled}
              onClick={onNext}
              className={cn(
                "w-full",
                isProjectActionEnabled
                  ? "w-full bg-white text-gray-900"
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
