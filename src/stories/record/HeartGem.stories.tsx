import type { Meta, StoryObj } from "@storybook/nextjs";

import DefaultHeartGem from "@/components/record/stones/DefaultHeartGem";
import FilledHeartGem from "@/components/record/stones/FilledHeartGem";

const meta = {
  title: "Record/HeartGem",
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <div className="flex min-h-80 min-w-80 items-center justify-center bg-gray-900 p-10">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DefaultHeartGem ariaLabel="기본 하트 원석" />,
};

export const Filled: Story = {
  render: () => <FilledHeartGem ariaLabel="완성된 하트 원석" />,
};

export const DefaultGlowLevels: Story = {
  name: "Default — Glow Levels",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-10">
      <div className="rounded-8 border-sea-blue-300 flex max-w-full gap-10 border border-dashed p-10">
        {[0, 1, 2, 3].map(level => (
          <section key={level} className="flex flex-col items-center gap-3">
            <DefaultHeartGem ariaLabel={`기본 하트 원석 ${level}단계`} glowLevel={level} />
            <p className="body-5 text-gray-500">Glow {level}</p>
          </section>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-10">
      <div className="rounded-8 border-sea-blue-300 flex max-w-full items-center gap-10 border border-dashed p-10">
        <section className="flex flex-col items-center gap-3">
          <DefaultHeartGem ariaLabel="작은 기본 하트 원석" className="size-17" />
          <p className="body-5 text-gray-500">Default size-17</p>
        </section>
        <section className="flex flex-col items-center gap-3">
          <DefaultHeartGem ariaLabel="기본 하트 원석" />
          <p className="body-5 text-gray-500">Default size-32</p>
        </section>
        <section className="flex flex-col items-center gap-3">
          <FilledHeartGem ariaLabel="작은 완성 하트 원석" className="size-17" />
          <p className="body-5 text-gray-500">Filled size-17</p>
        </section>
        <section className="flex flex-col items-center gap-3">
          <FilledHeartGem ariaLabel="완성 하트 원석" />
          <p className="body-5 text-gray-500">Filled size-32</p>
        </section>
      </div>
    </div>
  ),
};
