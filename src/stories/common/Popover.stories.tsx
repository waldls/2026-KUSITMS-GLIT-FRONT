import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import Popover from "@/components/common/Popover";
import { COMPETENCE_ITEMS } from "@/constants/competence";

const meta = {
  title: "Common/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "항목 1", dotColor: "#ffc022" },
      { label: "항목 2", dotColor: "#ffc022" },
      { label: "항목 3", dotColor: "#ffc022" },
    ],
  },
};

export const WithSelectedItem: Story = {
  args: {
    items: [
      { label: "항목 1", dotColor: "#ffc022", selected: true },
      { label: "항목 2", dotColor: "#ffc022" },
      { label: "항목 3", dotColor: "#ffc022" },
    ],
  },
};

export const WithoutDot: Story = {
  args: {
    items: [{ label: "항목 1" }, { label: "항목 2" }, { label: "항목 3" }],
  },
};

export const Competence: Story = {
  args: { items: COMPETENCE_ITEMS },
  render: args => {
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <Popover
        items={args.items.map((item, i) => ({
          ...item,
          selected: selected === i,
          onClick: () => setSelected(i),
        }))}
      />
    );
  },
};
