import type { Meta, StoryObj } from "@storybook/nextjs";

import Button from "@/components/common/Button";

type ButtonState = "default" | "pressed" | "tap";

const SwatchIcon = ({ size = "md" }: { size?: "lg" | "md" }) => (
  <span
    className={
      size === "lg"
        ? "rounded-2 bg-sea-blue-500 block size-6"
        : "rounded-2 bg-sea-blue-500 block size-4"
    }
  />
);

const STATE_CLASS_NAMES: Record<ButtonState, string | undefined> = {
  default: undefined,
  pressed: "bg-sea-blue-400/[.93]",
  tap: "bg-gray-400/40 text-offwhite-500",
};

const ButtonPreview = ({ size, state }: { size: "lg" | "md"; state: ButtonState }) => (
  <Button
    variant="default"
    size={size}
    fullWidth={size === "lg"}
    className={STATE_CLASS_NAMES[state]}
    leftIcon={<SwatchIcon size={size} />}
    rightIcon={<SwatchIcon size={size} />}>
    텍스트 입력하기
  </Button>
);

const meta = {
  title: "Common/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "텍스트 입력하기",
    variant: "default",
    size: "md",
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "gray"],
    },
    size: {
      control: "radio",
      options: ["lg", "md"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LgDefault: Story = {
  render: () => <ButtonPreview size="lg" state="default" />,
};

export const LgPressed: Story = {
  render: () => <ButtonPreview size="lg" state="pressed" />,
};

export const LgTap: Story = {
  render: () => <ButtonPreview size="lg" state="tap" />,
};

export const MdDefault: Story = {
  render: () => <ButtonPreview size="md" state="default" />,
};

export const MdPressed: Story = {
  render: () => <ButtonPreview size="md" state="pressed" />,
};

export const MdTap: Story = {
  render: () => <ButtonPreview size="md" state="tap" />,
};

export const AllVariants: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="min-h-screen bg-black p-10">
      <div className="rounded-8 border-sea-blue-300 mx-auto flex w-[888px] max-w-full flex-col border border-dashed p-11">
        <div className="flex flex-col gap-6">
          <ButtonPreview size="lg" state="default" />
          <ButtonPreview size="lg" state="pressed" />
          <ButtonPreview size="lg" state="tap" />
        </div>

        <div className="mt-22 flex flex-col items-start gap-3">
          <ButtonPreview size="md" state="default" />
          <ButtonPreview size="md" state="pressed" />
          <ButtonPreview size="md" state="tap" />
        </div>
      </div>
    </div>
  ),
};
