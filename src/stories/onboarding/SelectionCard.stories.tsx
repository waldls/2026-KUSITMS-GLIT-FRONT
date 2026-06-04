import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import SelectionCard from "@/components/onboarding/SelectionCard";
import SelectionCardGrid from "@/components/onboarding/SelectionCardGrid";
import { JOB_OPTIONS, STATUS_OPTIONS } from "@/constants/onboarding";

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

export const AllVariants: Story = {
  args: { label: "" },
  render: () => {
    const [jobValue, setJobValue] = useState("");
    const [statusValue, setStatusValue] = useState("");
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <label className="body-5 text-gray-600">Default / Selected</label>
          <div className="flex gap-3">
            <SelectionCard {...JOB_OPTIONS[0]} selected={false} onClick={() => {}} />
            <SelectionCard {...JOB_OPTIONS[0]} selected={true} onClick={() => {}} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label className="body-5 text-gray-600">Job Options</label>
          <SelectionCardGrid options={JOB_OPTIONS} value={jobValue} onChange={setJobValue} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="body-5 text-gray-600">Status Options</label>
          <SelectionCardGrid
            options={STATUS_OPTIONS}
            value={statusValue}
            onChange={setStatusValue}
          />
        </div>
      </div>
    );
  },
};
