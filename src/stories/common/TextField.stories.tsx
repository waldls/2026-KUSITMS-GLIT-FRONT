import type { Meta, StoryObj } from "@storybook/nextjs";

import TextField from "@/components/common/TextField";

const meta = {
  title: "Common/TextField",
  component: TextField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "내용 입력",
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "내용 입력",
    rightIcon: <div className="bg-sea-blue-500 size-6 rounded-sm" />,
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    placeholder: "내용 입력",
    errorMessage: "내용 입력",
    rightIcon: <div className="bg-sea-blue-500 size-6 rounded-sm" />,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="mt-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">기본 상태</label>
        <TextField
          placeholder="내용 입력"
          rightIcon={<div className="bg-sea-blue-500 size-6 rounded-sm" />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">포커스(탭) 상태 - 탭해보세요!</label>
        <TextField
          placeholder="내용 입력"
          autoFocus
          rightIcon={<div className="bg-sea-blue-500 size-6 rounded-sm" />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">에러 상태</label>
        <TextField
          variant="error"
          placeholder="내용 입력"
          errorMessage="내용 입력"
          rightIcon={<div className="bg-sea-blue-500 size-6 rounded-sm" />}
        />
      </div>
    </div>
  ),
};
