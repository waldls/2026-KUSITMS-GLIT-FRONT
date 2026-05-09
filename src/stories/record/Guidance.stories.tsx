import type { Meta, StoryObj } from "@storybook/nextjs";

import Guidance from "@/components/record/Guidance";

const meta = {
  title: "Record/Guidance",
  component: Guidance,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <div className="flex w-full items-center justify-center bg-black text-white">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Guidance>;

export default meta;
type Story = StoryObj<typeof meta>;

const guidanceItems = [
  "팀 프로젝트에서 기능 명세를 내가 처음 잡아야 했던 상황",
  "대외활동 중 행사를 기획하게 됐는데 기한은 2주밖에 없었던 경험",
  "공모전 기획안을 팀장으로서 처음부터 끝까지 리드해야 했던 상황",
] as const;

export const Default: Story = {
  render: () => <Guidance items={guidanceItems}>작성 가이드</Guidance>,
};

export const Drop: Story = {
  render: () => (
    <Guidance defaultOpen items={guidanceItems}>
      작성 가이드
    </Guidance>
  ),
};

export const All_Variants: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex items-center justify-center bg-black p-10">
      <div className="mx-auto flex w-222 max-w-full flex-row gap-12">
        <section className="rounded-8 border-sea-blue-300 flex flex-1 flex-col items-center gap-2 border border-dashed p-11">
          <p className="body-3 text-offwhite-300">Default</p>
          <Guidance items={guidanceItems}>작성 가이드</Guidance>
        </section>

        <section className="rounded-8 border-sea-blue-300 flex flex-1 flex-col items-center gap-2 border border-dashed p-11">
          <p className="body-3 text-offwhite-300">Drop</p>
          <Guidance defaultOpen items={guidanceItems}>
            작성 가이드
          </Guidance>
        </section>
      </div>
    </div>
  ),
};
