import type { Meta, StoryObj } from "@storybook/nextjs";

import SkillTag, { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import GlowingSkillStone, { type SkillStoneId } from "@/components/record/stones/GlowingSkillStone";

const meta = {
  title: "Record/GlowingSkillStone",
  component: GlowingSkillStone,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <div className="flex min-h-100 min-w-100 items-center justify-center bg-gray-900 p-10">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof GlowingSkillStone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: { skillId: 1 },
  render: () => (
    <div className="grid grid-cols-5 gap-7">
      {RECORD_SKILL_TAGS.map(skill => (
        <section key={skill.id} className="flex flex-col items-center gap-3">
          <GlowingSkillStone skillId={skill.id as SkillStoneId} className="size-16" />
          <SkillTag skillId={skill.id}>{skill.label}</SkillTag>
        </section>
      ))}
    </div>
  ),
};

export const Animated: Story = {
  args: { skillId: 1, animate: true },
  render: args => <GlowingSkillStone {...args} className="size-24" />,
};

export const Sizes: Story = {
  args: { skillId: 1 },
  render: () => (
    <div className="flex items-end gap-8">
      <GlowingSkillStone skillId={1} className="size-9" />
      <GlowingSkillStone skillId={1} className="size-14" />
      <GlowingSkillStone skillId={1} className="size-20" />
      <GlowingSkillStone skillId={1} className="size-28" />
    </div>
  ),
};
