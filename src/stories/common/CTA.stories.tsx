import type { Meta, StoryObj } from "@storybook/nextjs";

import CTA from "@/components/common/CTA";

const SwatchIcon = ({ size = "md" }: { size?: "lg" | "md" }) => (
  <span
    className={
      size === "lg"
        ? "rounded-2 bg-sea-blue-500 block size-6"
        : "rounded-2 bg-sea-blue-500 block size-4"
    }
  />
);

const meta = {
  title: "Common/CTA",
  component: CTA,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "텍스트 입력하기",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "tap"],
    },
  },
} satisfies Meta<typeof CTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    leftIcon: <SwatchIcon size="lg" />,
    children: "텍스트 입력하기",
  },
};

export const Tap: Story = {
  args: {
    variant: "tap",
    leftIcon: <SwatchIcon size="lg" />,
    children: "텍스트 입력하기",
  },
};

export const AllVariants: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="bg-black p-10">
      <div className="rounded-8 border-sea-blue-300 mx-auto w-100 border border-dashed p-7">
        <div className="flex flex-col items-center gap-6">
          <CTA variant="default" leftIcon={<SwatchIcon size="lg" />}>
            텍스트 입력하기
          </CTA>
          <CTA variant="tap" leftIcon={<SwatchIcon size="lg" />}>
            텍스트 입력하기
          </CTA>
        </div>
      </div>
    </div>
  ),
};
