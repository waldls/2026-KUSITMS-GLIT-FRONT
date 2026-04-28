import type { Meta, StoryObj } from "@storybook/nextjs";

import Header from "@/components/common/Header";

const meta = {
  title: "Common/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <div className="w-full py-10">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "헤더명 입력",
  },
};
