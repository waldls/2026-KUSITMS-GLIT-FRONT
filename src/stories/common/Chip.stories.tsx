import type { Meta, StoryObj } from "@storybook/nextjs";

import StarIcon from "@/assets/icons/icon_star_01.svg";
import Chip from "@/components/common/Chip";

const meta = {
  title: "Common/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {
  args: { selected: true, children: "내용 입력" },
};

export const SelectedWithIcon: Story = {
  args: { selected: true, leftIcon: <StarIcon />, children: "내용 입력" },
};

export const Unselected: Story = {
  args: { selected: false, children: "내용 입력" },
};

export const UnselectedWithIcon: Story = {
  args: { selected: false, leftIcon: <StarIcon />, children: "내용 입력" },
};

export const AllStates: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip selected>내용 입력</Chip>
      <Chip>내용 입력</Chip>
      <Chip selected leftIcon={<StarIcon />}>
        내용 입력
      </Chip>
      <Chip leftIcon={<StarIcon />}>내용 입력</Chip>
    </div>
  ),
};
