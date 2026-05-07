import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import SelectionCard from "@/components/onboarding/SelectionCard";
import SelectionCardGrid from "@/components/onboarding/SelectionCardGrid";
import { JOB_OPTIONS, STATUS_OPTIONS } from "@/data/onboarding";

const meta = {
  title: "Onboarding/SelectionCard",
  component: SelectionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...JOB_OPTIONS[0],
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    ...JOB_OPTIONS[0],
    selected: true,
  },
};

export const JobOptions: Story = {
  args: { label: "" },
  render: () => {
    const [value, setValue] = useState("");
    return <SelectionCardGrid options={JOB_OPTIONS} value={value} onChange={setValue} />;
  },
};

export const StatusOptions: Story = {
  args: { label: "" },
  render: () => {
    const [value, setValue] = useState("");
    return <SelectionCardGrid options={STATUS_OPTIONS} value={value} onChange={setValue} />;
  },
};
