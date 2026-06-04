export type ProjectSheetStep = "tag" | "title" | "task";

export const normalizeTasks = (tasks: string[]) => tasks.map(task => task.trim()).filter(Boolean);

export const isProjectStepReady = (
  step: ProjectSheetStep,
  selectedTag: string | null,
  title: string,
  tasks: string[],
) => {
  if (step === "tag") return selectedTag !== null;
  if (step === "title") return title.trim().length > 0;
  return tasks.some(task => task.trim().length > 0);
};

export const areTasksEqual = (tasksA: string[], tasksB: string[]) => {
  const normalizedTasksA = normalizeTasks(tasksA);
  const normalizedTasksB = normalizeTasks(tasksB);

  return (
    normalizedTasksA.length === normalizedTasksB.length &&
    normalizedTasksA.every((task, index) => task === normalizedTasksB[index])
  );
};
