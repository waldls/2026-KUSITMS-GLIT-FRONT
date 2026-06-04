import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import Checkbox from "@/components/common/Checkbox";

const meta = {
  title: "Common/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { checked: false },
};

export const Selected: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const CheckedDisabled: Story = {
  args: { checked: true, disabled: true },
};

export const AllStates: Story = {
  args: {},
  render: () => {
    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(true);

    return (
      <div className="flex gap-3">
        <Checkbox checked={first} onChange={setFirst} />
        <Checkbox checked={second} onChange={setSecond} />
        <Checkbox disabled />
        <Checkbox checked disabled />
      </div>
    );
  },
};
