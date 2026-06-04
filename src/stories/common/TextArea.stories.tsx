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

export const WithCount: Story = {
  args: {
    placeholder: "내용입력",
    showCount: true,
    maxLength: 300,
  },
};

export const WithoutCount: Story = {
  args: {
    placeholder: "내용입력",
    showCount: false,
  },
};

export const Filled: Story = {
  args: {
    placeholder: "내용입력",
    defaultValue: "입력된 내용입니다.",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "내용입력",
    disabled: true,
  },
};

export const DisabledFilled: Story = {
  args: {
    placeholder: "내용입력",
    defaultValue: "입력된 내용입니다.",
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Default</label>
        <TextArea placeholder="내용입력" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Filled</label>
        <TextArea placeholder="내용입력" defaultValue="입력된 내용입니다." />
      </div>
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Without Count</label>
        <TextArea placeholder="내용입력" showCount={false} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Disabled</label>
        <TextArea placeholder="내용입력" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Disabled Filled</label>
        <TextArea placeholder="내용입력" defaultValue="입력된 내용입니다." disabled />
      </div>
    </div>
  ),
};
