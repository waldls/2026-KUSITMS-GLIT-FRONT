import type { Meta, StoryObj } from "@storybook/nextjs";

import ScrumTextArea from "@/components/record/ScrumTextArea";

const meta = {
  title: "Record/ScrumTextArea",
  component: ScrumTextArea,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrumTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
