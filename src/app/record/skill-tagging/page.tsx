"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import { SELECT_SKILLS_MOCK } from "@/data/record/mock";

import SkillTaggingFail from "./components/SkillTaggingFail";
import SkillTaggingSuccess from "./components/SkillTaggingSuccess";

interface SkillTaggingTask {
  id: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: number;
}

function getFallbackTasks() {
  return SELECT_SKILLS_MOCK.projects.flatMap(project =>
    project.tasks.map(task => ({
      ...task,
      projectId: project.id,
      projectTag: project.tag,
      projectTitle: project.title,
      skillId: RECORD_SKILL_TAGS[0].id,
    })),
  );
}

function getStoredTasks() {
  if (typeof window === "undefined") return getFallbackTasks();

  if (!window.sessionStorage.getItem("star-log-tasks")) return getFallbackTasks();

  try {
    return ((parsedTasks: SkillTaggingTask[]) =>
      parsedTasks.length > 0 ? parsedTasks : getFallbackTasks())(
      JSON.parse(window.sessionStorage.getItem("star-log-tasks") ?? "[]") as SkillTaggingTask[],
    );
  } catch {
    return getFallbackTasks();
  }
}

const SkillTaggingContent = () => {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");

  if (state === "fail") {
    return <SkillTaggingFail />;
  }

  return (
    <SkillTaggingSuccess tasks={getStoredTasks()} shouldCheckMiniReport={state === "success"} />
  );
};

const page = () => {
  return (
    <Suspense>
      <SkillTaggingContent />
    </Suspense>
  );
};

export default page;
