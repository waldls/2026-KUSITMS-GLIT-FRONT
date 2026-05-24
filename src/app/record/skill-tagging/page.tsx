"use client";

import { useEffect, useState } from "react";

import LoadingScreen from "@/components/common/LoadingScreen";
import SkillTaggingFail from "@/containers/record/skill-tagging/SkillTaggingFail";
import SkillTaggingSuccess from "@/containers/record/skill-tagging/SkillTaggingSuccess";
import { type AiTaggingResultResponse, getAiTaggingResult } from "@/lib/apis/record/record";

interface SkillTaggingTask {
  id: number;
  starRecordId?: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: number;
}

const SKILL_TAGGING_STATE_KEY = "skill-tagging-state";

function getStoredTasks() {
  if (typeof window === "undefined") return [];

  if (!window.sessionStorage.getItem("star-log-tasks")) return [];

  try {
    return ((parsedTasks: SkillTaggingTask[]) => (parsedTasks.length > 0 ? parsedTasks : []))(
      JSON.parse(window.sessionStorage.getItem("star-log-tasks") ?? "[]") as SkillTaggingTask[],
    );
  } catch {
    return [];
  }
}

const SkillTaggingContent = () => {
  const state =
    typeof window === "undefined" ? null : window.sessionStorage.getItem(SKILL_TAGGING_STATE_KEY);
  const [results, setResults] = useState<AiTaggingResultResponse[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (state === "fail") return;

    let ignore = false;

    const loadResults = async () => {
      try {
        const starRecordIds = getStoredTasks()
          .map(task => task.starRecordId)
          .filter((starRecordId): starRecordId is number => Boolean(starRecordId));

        if (starRecordIds.length === 0) throw new Error("AI 태깅 결과를 찾지 못했어요");

        const nextResults = await Promise.all(starRecordIds.map(getAiTaggingResult));

        if (nextResults.some(result => result?.status !== "SUCCESS")) {
          throw new Error("AI 태깅이 완료되지 않았어요");
        }

        if (!ignore) {
          setResults(
            nextResults.filter((result): result is AiTaggingResultResponse => result !== null),
          );
        }
      } catch {
        if (!ignore) setHasError(true);
      }
    };

    void loadResults();

    return () => {
      ignore = true;
    };
  }, [state]);

  if (state === "fail" || hasError) {
    return <SkillTaggingFail />;
  }

  if (!results) {
    return <LoadingScreen />;
  }

  return <SkillTaggingSuccess results={results} />;
};

const Page = () => <SkillTaggingContent />;

export default Page;
