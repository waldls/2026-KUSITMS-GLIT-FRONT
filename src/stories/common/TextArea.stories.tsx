import type { Meta, StoryObj } from "@storybook/nextjs";

import TextArea from "@/components/common/TextArea";

const meta = {
  title: "Common/TextArea",
  component: TextArea,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "내용입력",
  },
};
