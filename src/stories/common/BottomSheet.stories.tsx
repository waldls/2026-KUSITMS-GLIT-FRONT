import type { Meta, StoryObj } from "@storybook/nextjs";

import { CancelIcon } from "@/assets/icons";
import BottomSheet from "@/components/common/BottomSheet";

const FULL_SCREEN_BG = (Story: React.ComponentType) => (
  <div className="relative h-dvh w-full bg-gray-400">
    <Story />
  </div>
);

const meta = {
  title: "Common/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "400px" },
    },
  },
  args: {
    isOpen: true,
    children: <p className="body-2 text-gray-100">바텀시트 내용입니다.</p>,
  },
  decorators: [FULL_SCREEN_BG],
  tags: ["autodocs"],
  argTypes: {
    isOpen: { control: "boolean" },
    text: { control: "text" },
    icon: { control: false },
    onIconClick: { action: "onIconClick" },
    onTextClick: { action: "onTextClick" },
    children: { control: false },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoHeader: Story = {};

export const IconOnly: Story = {
  args: {
    icon: <CancelIcon className="size-6" />,
  },
};

export const TextOnly: Story = {
  args: {
    text: "완료",
  },
};

export const WithBoth: Story = {
  args: {
    text: "완료",
    icon: <CancelIcon className="size-6" />,
  },
};

export const LongContent: Story = {
  args: {
    text: "완료",
    icon: <CancelIcon className="size-6" />,
  },
  render: args => (
    <BottomSheet {...args}>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} className="body-2 text-gray-100">
            {i + 1}번째 내용입니다. 내용이 길어지면 이런 모습으로 표시됩니다.
          </p>
        ))}
      </div>
    </BottomSheet>
  ),
};
