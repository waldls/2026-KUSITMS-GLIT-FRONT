import type { Meta, StoryObj } from "@storybook/nextjs";

import EyeOpenIcon from "@/assets/icons/icon_eye_open.svg";
import Tag from "@/components/common/Tag";

const meta = {
  title: "Common/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gray: Story = {
  args: { variant: "gray", children: "태그" },
};

export const Tag100: Story = {
  args: { variant: "tag100", children: "태그" },
};

export const Tag200: Story = {
  args: { variant: "tag200", children: "태그" },
};

export const Tag300: Story = {
  args: { variant: "tag300", children: "태그" },
};

export const Tag400: Story = {
  args: { variant: "tag400", children: "태그" },
};

export const Tag500: Story = {
  args: { variant: "tag500", children: "태그" },
};

export const AllVariants: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="gray">역량 없음</Tag>
      <Tag variant="tag100">발견·분석</Tag>
      <Tag variant="tag200">기획·실행</Tag>
      <Tag variant="tag300">협업·조율</Tag>
      <Tag variant="tag400">문제해결·개선</Tag>
      <Tag variant="tag500">성찰·성장</Tag>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="gray">
        <EyeOpenIcon />
        역량 없음
      </Tag>
      <Tag variant="tag100">
        <EyeOpenIcon />
        발견·분석
      </Tag>
      <Tag variant="tag200">
        <EyeOpenIcon />
        기획·실행
      </Tag>
      <Tag variant="tag300">
        <EyeOpenIcon />
        협업·조율
      </Tag>
      <Tag variant="tag400">
        <EyeOpenIcon />
        문제해결·개선
      </Tag>
      <Tag variant="tag500">
        <EyeOpenIcon />
        성찰·성장
      </Tag>
    </div>
  ),
};
