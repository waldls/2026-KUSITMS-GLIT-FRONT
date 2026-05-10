import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import StarIcon from "@/assets/icons/icon_star_01.svg";
import Chip from "@/components/common/Chip";

const meta = {
  title: "Common/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "radio",
      options: ["default", "selected", "unselected", "input"],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default", children: "내용 입력" },
};

export const DefaultWithIcon: Story = {
  args: { state: "default", leftIcon: <StarIcon />, children: "내용 입력" },
};

export const Selected: Story = {
  args: { state: "selected", children: "내용 입력" },
};

export const SelectedWithIcon: Story = {
  args: { state: "selected", leftIcon: <StarIcon />, children: "내용 입력" },
};

export const Unselected: Story = {
  args: { state: "unselected", children: "내용 입력" },
};

export const UnselectedWithIcon: Story = {
  args: { state: "unselected", leftIcon: <StarIcon />, children: "내용 입력" },
};

export const Input: Story = {
  args: { children: null },
  render: () => {
    const [chips, setChips] = useState<{ id: number; text: string; confirmed: boolean }[]>([
      { id: 0, text: "", confirmed: false },
    ]);

    const handleConfirm = (id: number, value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setChips(prev => prev.map(c => (c.id === id ? { ...c, text: trimmed, confirmed: true } : c)));
    };

    return (
      <div className="flex flex-wrap items-center gap-2">
        {chips.map(chip =>
          chip.confirmed ? (
            <Chip key={chip.id} state="default">
              {chip.text}
            </Chip>
          ) : (
            <Chip key={chip.id} state="input" onConfirm={val => handleConfirm(chip.id, val)} />
          ),
        )}
      </div>
    );
  },
};

export const AllStates: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip>내용 입력</Chip>
      <Chip state="selected">내용 입력</Chip>
      <Chip state="unselected">내용 입력</Chip>
      <Chip leftIcon={<StarIcon />}>내용 입력</Chip>
      <Chip state="selected" leftIcon={<StarIcon />}>
        내용 입력
      </Chip>
      <Chip state="unselected" leftIcon={<StarIcon />}>
        내용 입력
      </Chip>
    </div>
  ),
};
