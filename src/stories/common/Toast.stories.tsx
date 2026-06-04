import type { Meta, StoryObj } from "@storybook/nextjs";

import Toast from "@/components/common/Toast";

const meta = {
  title: "Common/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contents: "내용 입력",
  },
};

export const Success: Story = {
  args: {
    contents: "변경되었어요",
    variant: "success",
  },
};

export const WithoutLeftIcon: Story = {
  args: {
    contents: "내용 입력",
    showLeftIcon: false,
  },
};

export const WithoutCloseButton: Story = {
  args: {
    contents: "내용 입력",
    showCloseButton: false,
  },
};

export const MaxContents: Story = {
  args: {
    contents: "서른한 글자를 초과하는 내용을 입력하면 이 뒷부분이 잘립니다",
  },
};

export const AllStates: Story = {
  args: {
    contents: "내용 입력",
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Toast contents="내용 입력" />
      <Toast contents="변경되었어요" variant="success" />
      <Toast contents="내용 입력" showLeftIcon={false} />
      <Toast contents="내용 입력" showCloseButton={false} />
    </div>
  ),
};
