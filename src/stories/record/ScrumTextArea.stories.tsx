import type { Meta, StoryObj } from "@storybook/nextjs";

import ScrumTextArea from "@/components/record/ScrumTextArea";

const meta = {
  title: "Record/ScrumTextArea",
  component: ScrumTextArea,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrumTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Filled: Story = {
  args: {
    value: ["어드민 페이지 화면 작업", "API 연동 완료"],
  },
};

export const MaxItems: Story = {
  args: {
    value: ["항목 1", "항목 2", "항목 3", "항목 4", "항목 5"],
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Default (Empty)</label>
        <ScrumTextArea />
      </div>
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Filled</label>
        <ScrumTextArea value={["어드민 페이지 화면 작업", "API 연동 완료"]} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Max Items (5)</label>
        <ScrumTextArea value={["항목 1", "항목 2", "항목 3", "항목 4", "항목 5"]} />
      </div>
    </div>
  ),
};
