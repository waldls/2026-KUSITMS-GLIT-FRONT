import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import WheelTimePicker, { type TimeValue } from "@/components/my/WheelTimePicker";

const DEFAULT_TIME: TimeValue = { hour: 9, minute: 0, meridiem: "Am" };

const meta = {
  title: "My/WheelTimePicker",
  component: WheelTimePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="w-100 bg-gray-900 p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    value: DEFAULT_TIME,
    disabled: false,
    onChange: () => {},
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof WheelTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => {
    const [time, setTime] = useState<TimeValue>(DEFAULT_TIME);
    return <WheelTimePicker value={time} disabled={false} onChange={setTime} />;
  },
};
