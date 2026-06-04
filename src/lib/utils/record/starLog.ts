import type { SkillStoneId } from "@/components/record/stones/GlowingSkillStone";
import type { StarImageAttachment } from "@/containers/record/star-log/StarImageUploader";
import { postConfirm, postPresignedUrl } from "@/lib/apis/record/starImage";
import { replaceRecordHistory } from "@/lib/utils/recordNavigation";
import {
  SKILL_TAGGING_STATE_KEY,
  STAR_LOG_COMPLETED_STAR_RECORD_IDS_KEY,
  STAR_LOG_TASKS_KEY,
} from "@/lib/utils/recordSession";
import type { Competency } from "@/types/competency";

export const STAR_STEPS = [
  {
    key: "situation",
    apiStep: "situation-task",
    param: "st",
    headerTitle: "상황/과제",
    question: "어떤 상황에서 이 일을 맡게 됐고, 목표는 무엇이었나요?",
    placeholder: "3~5문장이면 충분해요",
  },
  {
    key: "action",
    apiStep: "action",
    param: "a",
    headerTitle: "행동",
    question: "목표를 위해 어떤 행동을 했고, 그렇게 한 이유도 있었나요?",
    placeholder: "3~5문장이면 충분해요",
  },
  {
    key: "result",
    apiStep: "result",
    param: "r",
    headerTitle: "결과",
    question: "어떤 결과로 이어졌고, 이 경험에서 무엇을 배웠나요?",
    placeholder: "3~5문장이면 충분해요",
  },
] as const;

export type StarStep = (typeof STAR_STEPS)[number]["key"];

export type StarLogViewState =
  | "form"
  | "taskComplete"
  | "allComplete"
  | "analyzing"
  | "delayed"
  | "skillTaggingSuccess"
  | "skillTaggingFail";

export type StarLogStateView = Exclude<
  StarLogViewState,
  "form" | "skillTaggingSuccess" | "skillTaggingFail"
>;

const STAR_LOG_STATE_PARAM_MAP: Record<StarLogStateView, string> = {
  taskComplete: "task-complete",
  allComplete: "all-complete",
  analyzing: "analyzing",
  delayed: "delayed",
};

export const ANALYZING_STATUS_POLL_LIMIT = 20;
export const triggeredAiTaggingKeys = new Set<string>();

export interface StarLogTask {
  id: number;
  starRecordId?: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: SkillStoneId;
  competency?: Competency;
}

export const getInitialStarLogTasks = (): StarLogTask[] => {
  if (typeof window === "undefined") return [];

  const storedTasks = window.sessionStorage.getItem(STAR_LOG_TASKS_KEY);
  if (!storedTasks) return [];

  try {
    const parsedTasks = JSON.parse(storedTasks) as StarLogTask[];
    return parsedTasks.length > 0 ? parsedTasks : [];
  } catch {
    return [];
  }
};

export const getInitialCompletedStarRecordIds = () => {
  if (typeof window === "undefined") return [];

  const storedIds = window.sessionStorage.getItem(STAR_LOG_COMPLETED_STAR_RECORD_IDS_KEY);
  if (!storedIds) return [];

  try {
    const parsedIds = JSON.parse(storedIds) as number[];
    return parsedIds.filter(id => Number.isFinite(id));
  } catch {
    return [];
  }
};

export const saveCompletedStarRecordIds = (ids: number[]) => {
  window.sessionStorage.setItem(STAR_LOG_COMPLETED_STAR_RECORD_IDS_KEY, JSON.stringify(ids));
};

const getCurrentPathname = () =>
  typeof window === "undefined" ? "/record/star-log" : window.location.pathname;

const getCurrentSearchParams = () =>
  new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

export const getInitialStarLogStepIndex = () => {
  if (typeof window === "undefined") return 0;

  const stepParam = new URLSearchParams(window.location.search).get("step");

  return Math.max(
    0,
    STAR_STEPS.findIndex(step => step.param === stepParam),
  );
};

export const getInitialStarLogViewState = (): StarLogViewState => {
  if (typeof window === "undefined") return "form";

  const stateParam = new URLSearchParams(window.location.search).get("state");

  if (stateParam === "task-complete") return "taskComplete";
  if (stateParam === "all-complete") return "allComplete";
  if (stateParam === "analyzing") return "analyzing";
  if (stateParam === "delayed") return "delayed";

  return "form";
};

export const createStarLogStepHref = (
  nextStepIndex: number,
  viewState: StarLogViewState = "form",
) => {
  const pathname = getCurrentPathname();
  const searchParams = getCurrentSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  if (viewState === "form") {
    params.delete("state");
  } else if (viewState in STAR_LOG_STATE_PARAM_MAP) {
    params.set("state", STAR_LOG_STATE_PARAM_MAP[viewState as StarLogStateView]);
  }

  params.set("step", STAR_STEPS[nextStepIndex].param);
  return `${pathname}?${params.toString()}`;
};

export const replaceStarLogHistory = (href: string) => {
  replaceRecordHistory(href);
};

export const replaceStarLogViewState = (
  nextViewState: StarLogStateView,
  stepIndex: number,
  setViewState: (viewState: StarLogViewState) => void,
) => {
  setViewState(nextViewState);
  replaceStarLogHistory(createStarLogStepHref(stepIndex, nextViewState));
};

export const replaceSkillTaggingView = (
  state: "success" | "fail",
  setViewState: (viewState: StarLogViewState) => void,
) => {
  window.sessionStorage.setItem(SKILL_TAGGING_STATE_KEY, state);
  replaceRecordHistory("/record/skill-tagging");
  setViewState(state === "success" ? "skillTaggingSuccess" : "skillTaggingFail");
};

export const normalizeStarLogImageUrl = (url?: string) => {
  if (!url) return "";
  let normalized = url;
  if (normalized.startsWith("http://")) {
    normalized = normalized.replace("http://", "https://");
  }
  if (normalized.startsWith("/")) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (apiBaseUrl) {
      const base = apiBaseUrl.replace(/\/+$/, "");
      normalized = `${base}${normalized}`;
    }
  }
  return normalized;
};

const getUploadImageMimeType = async (file: File) => {
  if (file.type === "image/png" || file.type === "image/jpeg") return file.type;

  if (file.type) throw new Error("JPG 또는 PNG 이미지만 업로드할 수 있어요");

  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

  if (isPng) return "image/png";
  if (isJpeg) return "image/jpeg";

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "png") return "image/png";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";

  throw new Error("JPG 또는 PNG 이미지만 업로드할 수 있어요");
};

export const uploadStarLogImage = async (starRecordId: number, image: StarImageAttachment) => {
  if (!image.file) throw new Error("업로드할 이미지 파일이 없습니다");
  const mimeType = await getUploadImageMimeType(image.file);
  const uploadTargets = await postPresignedUrl(starRecordId, {
    mimeTypes: [mimeType],
  });
  const uploadTarget = uploadTargets?.[0];

  if (!uploadTarget?.presignedUrl || !uploadTarget.imageKey) {
    throw new Error("이미지 업로드 URL을 발급받지 못했어요");
  }

  const response = await fetch(uploadTarget.presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: image.file,
  });

  if (!response.ok) throw new Error("이미지를 업로드하지 못했어요");

  await postConfirm(starRecordId, { imageKeys: [uploadTarget.imageKey] });
};
