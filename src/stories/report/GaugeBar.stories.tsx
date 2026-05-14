import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";

import GaugeBar from "@/components/report/GaugeBar";

const withWidth = (Story: React.ComponentType) => (
  <div className="w-80">
    <Story />
  </div>
);

const meta = {
  title: "Report/GaugeBar",
  component: GaugeBar,
  parameters: {
    layout: "centered",
  },
  globals: {
    backgrounds: { value: "light" },
  },
  tags: ["autodocs"],
  args: {
    progressRate: 0.5,
    isGeneratable: false,
  },
  argTypes: {
    progressRate: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
    },
    isGeneratable: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof GaugeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  decorators: [withWidth],
};

// ─── 개별 케이스 ────────────────────────────────────────────────────────────

export const Empty: Story = {
  name: "0% — 비어있음",
  decorators: [withWidth],
  args: { progressRate: 0, isGeneratable: false },
};

export const InProgress: Story = {
  name: "70% — 진행 중",
  decorators: [withWidth],
  args: { progressRate: 0.7, isGeneratable: false },
};

export const Full: Story = {
  name: "100% — 리포트 생성 가능",
  decorators: [withWidth],
  args: { progressRate: 1, isGeneratable: true },
};

// ─── 전체 변형 모음 ────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "전체 변형 모음",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="mx-auto flex w-80 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="body-4 text-gray-700">0%</p>
          <GaugeBar progressRate={0} isGeneratable={false} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="body-4 text-gray-700">30%</p>
          <GaugeBar progressRate={0.3} isGeneratable={false} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="body-4 text-gray-700">70%</p>
          <GaugeBar progressRate={0.7} isGeneratable={false} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="body-4 text-sea-blue-400">100% — 생성 가능</p>
          <GaugeBar progressRate={1} isGeneratable={true} />
        </div>
      </div>
    </div>
  ),
};
