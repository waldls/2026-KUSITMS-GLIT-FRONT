import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import Toggle from "@/components/common/Toggle";

const meta = {
  title: "Common/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {
  args: {
    checked: true,
    onChange: () => {},
  },
};

export const Off: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
  render: () => {
    const [checked, setChecked] = useState(false);

    return <Toggle checked={checked} onChange={setChecked} />;
  },
};
