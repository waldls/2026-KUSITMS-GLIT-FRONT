import type { Meta, StoryObj } from "@storybook/nextjs";

import ExampleButton from "../../components/common/ExampleButton";

const meta = {
  title: "Common/ExampleButton",
  component: ExampleButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { label: "버튼" },
} satisfies Meta<typeof ExampleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongLabel: Story = {
  args: { label: "긴 텍스트 버튼입니다" },
};

export const ShortLabel: Story = {
  args: { label: "확인" },
};
