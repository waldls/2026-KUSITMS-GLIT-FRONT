import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import Popover from "@/components/common/Popover";

const meta = {
  title: "Common/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "항목 1", dotClassName: "bg-tag-300" },
      { label: "항목 2", dotClassName: "bg-tag-300" },
      { label: "항목 3", dotClassName: "bg-tag-300" },
    ],
  },
};

export const WithSelectedItem: Story = {
  args: {
    items: [
      { label: "항목 1", dotClassName: "bg-tag-300", selected: true },
      { label: "항목 2", dotClassName: "bg-tag-300" },
      { label: "항목 3", dotClassName: "bg-tag-300" },
    ],
  },
};

export const WithoutDot: Story = {
  args: {
    items: [{ label: "항목 1" }, { label: "항목 2" }, { label: "항목 3" }],
  },
};

export const Competence: Story = {
  args: {
    items: [
      { label: "발견/분석", dotClassName: "bg-tag-100" },
      { label: "기획/실행", dotClassName: "bg-tag-200" },
      { label: "협업/조율", dotClassName: "bg-tag-300" },
      { label: "문제해결/개선", dotClassName: "bg-tag-400" },
      { label: "성찰/성장", dotClassName: "bg-tag-500" },
    ],
  },
  render: args => {
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <Popover
        items={args.items.map((item, i) => ({
          ...item,
          selected: selected === i,
          onClick: () => setSelected(i),
        }))}
      />
    );
  },
};
