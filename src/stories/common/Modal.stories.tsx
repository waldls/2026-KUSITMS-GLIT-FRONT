import type { Decorator, Meta, StoryObj } from "@storybook/nextjs";

import Modal from "@/components/common/Modal";

const FULL_SCREEN_BG: Decorator = Story => (
  <div className="relative h-dvh w-full bg-gray-900">
    <Story />
  </div>
);

const meta = {
  title: "Common/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "400px" },
    },
  },
  decorators: [FULL_SCREEN_BG],
  tags: ["autodocs"],
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
    contents: { control: "text" },
    type: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleButton: Story = {
  args: {
    isOpen: true,
    type: "single",
    title: "제목 입력",
    contents: "내용 입력",
    btnLabel: "확인",
    onBtnClick: () => {},
  },
};

export const DoubleButton: Story = {
  args: {
    isOpen: true,
    type: "double",
    title: "제목 입력",
    contents: "내용 입력",
    btnLLabel: "취소",
    btnRLabel: "확인",
    onBtnLClick: () => {},
    onBtnRClick: () => {},
  },
};
