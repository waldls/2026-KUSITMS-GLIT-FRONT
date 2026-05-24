import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import SkillTag, { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import DefaultHeartGem from "@/components/record/stones/DefaultHeartGem";
import SkillBlur from "@/components/record/stones/SkillBlur";

const meta = {
  title: "Record/SkillBlur",
  component: SkillBlur,
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
} satisfies Meta<typeof SkillBlur>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBlurs: Story = {
  args: { skillId: 1 },
  render: () => (
    <div className="grid grid-cols-5 gap-6">
      {RECORD_SKILL_TAGS.map(skill => (
        <section key={skill.id} className="flex flex-col items-center gap-3">
          <div className="bg-gray-850 @container-[size] relative size-24 overflow-visible rounded-full">
            <SkillBlur skillId={skill.id} />
          </div>
          <SkillTag skillId={skill.id}>{skill.label}</SkillTag>
        </section>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: { skillId: 1 },
  render: () => {
    const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

    const toggleSkill = (skillId: number) => {
      setSelectedSkillIds(prev =>
        prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId],
      );
    };

    return (
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex size-40 items-center justify-center">
          <DefaultHeartGem
            ariaLabel="역량 블러 확인용 하트 원석"
            glowLevel={selectedSkillIds.length === 0 ? 1 : 2}
            className="relative z-10 size-40"
          />
          <div className="@container-[size] pointer-events-none absolute inset-0 z-20">
            {RECORD_SKILL_TAGS.map(skill => (
              <SkillBlur
                key={skill.id}
                skillId={skill.id}
                active={selectedSkillIds.includes(skill.id)}
                animate={selectedSkillIds.length === RECORD_SKILL_TAGS.length}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {RECORD_SKILL_TAGS.map(skill => (
            <SkillTag
              key={skill.id}
              skillId={selectedSkillIds.includes(skill.id) ? skill.id : undefined}
              aria-pressed={selectedSkillIds.includes(skill.id)}
              onClick={() => toggleSkill(skill.id)}>
              {skill.label}
            </SkillTag>
          ))}
        </div>
      </div>
    );
  },
};
