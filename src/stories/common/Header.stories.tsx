import type { Meta, StoryObj } from "@storybook/nextjs";

import { SettingsIcon } from "@/assets/icons";
import Header from "@/components/common/Header";

const meta = {
  title: "Common/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    Story => (
      <div className="w-full bg-gray-900 py-10">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "헤더명 입력",
  },
};

export const WithRightLabel: Story = {
  args: {
    title: "헤더명 입력",
    rightLabel: "완료",
  },
};

export const WithRightIcon: Story = {
  args: {
    title: "헤더명 입력",
    rightIcon: <SettingsIcon className="size-6 text-gray-100" />,
  },
};

export const WithRightLabelAndIcon: Story = {
  args: {
    title: "헤더명 입력",
    rightLabel: "완료",
    rightIcon: <SettingsIcon className="size-6 text-gray-100" />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col">
      <Header title="Title Only" />
      <Header title="With Right Label" rightLabel="완료" />
      <Header
        title="With Right Icon"
        rightIcon={<SettingsIcon className="size-6 text-gray-100" />}
      />
      <Header
        title="With Label And Icon"
        rightLabel="완료"
        rightIcon={<SettingsIcon className="size-6 text-gray-100" />}
      />
    </div>
  ),
};
