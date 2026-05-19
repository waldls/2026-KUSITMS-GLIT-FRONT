import type { Meta, StoryObj } from "@storybook/nextjs";

import LoadingScreen from "@/components/common/LoadingScreen";

const meta = {
  title: "Common/LoadingScreen",
  component: LoadingScreen,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="mx-auto h-dvh w-full max-w-107.5 bg-gray-900">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoadingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <div className="h-50 w-50 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};
