import type { Meta, StoryObj } from "@storybook/nextjs";

import DropDown from "@/components/record/DropDown";

const sampleTags = ["큐시즘 스터디", "사이드 프로젝트", "웹 메이커스", "메이커스", "어쩌고,,"];

const meta = {
  title: "Record/DropDown",
  component: DropDown,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      const fullWidth = Boolean(
        (context.parameters as { fullWidthCanvas?: boolean }).fullWidthCanvas,
      );

      if (fullWidth) {
        return (
          <div className="min-h-screen w-full bg-black p-10 text-white">
            <Story />
          </div>
        );
      }

      return (
        <div className="flex w-150 max-w-full items-center justify-center bg-black p-10 text-white">
          <Story />
        </div>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof DropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    title: "제목 입력",
    description: "내용 입력",
  },
};

export const Expanded: Story = {
  args: {
    title: "제목 입력",
    description: "내용 입력",
    open: true,
    tags: sampleTags,
  },
};

export const Filled: Story = {
  args: {
    title: "제목 입력",
    description: "내용 입력",
    open: true,
    defaultInputValue: "제목",
    tags: sampleTags,
  },
};

export const AllVariants: Story = {
  args: {
    title: "제목 입력",
  },
  parameters: {
    layout: "fullscreen",
    fullWidthCanvas: true,
  },
  render: () => (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-10 md:grid-cols-2">
      <section className="flex min-w-0 flex-col gap-3">
        <p className="body-5 text-gray-400">접힘</p>
        <DropDown title="제목 입력" description="내용 입력" />
      </section>
      <section className="flex min-w-0 flex-col gap-3">
        <p className="body-5 text-gray-400">펼침</p>
        <DropDown title="제목 입력" description="내용 입력" open tags={sampleTags} />
      </section>
    </div>
  ),
};
