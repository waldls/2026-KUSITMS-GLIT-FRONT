import type { TagVariant } from "@/components/common/Tag";

export const TAG_BORDER_CLASS: Partial<Record<TagVariant, string>> = {
  tag100: "border-tag-100",
  tag200: "border-tag-200",
  tag300: "border-tag-300",
  tag400: "border-tag-400",
  tag500: "border-tag-500",
};

export const PRIMARY_CATEGORY_MAP: Record<string, { label: string; variant: TagVariant }> = {
  PLANNING_EXECUTION: { label: "기획/실행", variant: "tag100" },
  DISCOVERY_ANALYSIS: { label: "발견/분석", variant: "tag200" },
  COLLABORATION: { label: "협업/조율", variant: "tag300" },
  REFLECTION_GROWTH: { label: "성찰/성장", variant: "tag400" },
  PROBLEM_SOLVING: { label: "문제해결/개선", variant: "tag500" },
};
