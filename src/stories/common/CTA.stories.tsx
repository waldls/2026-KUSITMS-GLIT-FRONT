import type { Meta, StoryObj } from "@storybook/nextjs";

import { DownloadIcon, SearchIcon, StarOneIcon, WriteIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";

const meta = {
  title: "Common/CTA",
  component: CTA,
  parameters: {
    layout: "padded",
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
    children: "경로 저장하기",
  },
};

export const DefaultWithIcon: Story = {
  name: "Default (아이콘 있음)",
  args: {
    variant: "default",
    leftIcon: <DownloadIcon />,
    children: "경로 저장하기",
  },
};

export const Tap: Story = {
  args: {
    variant: "tap",
    children: "경로 저장하기",
  },
};

export const TapWithIcon: Story = {
  name: "Tap (아이콘 있음)",
  args: {
    variant: "tap",
    leftIcon: <StarOneIcon />,
    children: "즐겨찾기 추가",
  },
};

export const Disabled: Story = {
  args: {
    variant: "default",
    children: "경로 저장하기",
    disabled: true,
  },
};

export const DisabledWithIcon: Story = {
  name: "Disabled (아이콘 있음)",
  args: {
    variant: "default",
    leftIcon: <DownloadIcon />,
    children: "경로 저장하기",
    disabled: true,
  },
};

export const AllVariants: Story = {
  name: "전체 변형 모음",
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="bg-black p-10">
      <div className="rounded-8 border-sea-blue-300 mx-auto border border-dashed p-7">
        <div className="flex flex-col items-center gap-6">
          <CTA variant="default">경로 저장하기</CTA>
          <CTA variant="default" leftIcon={<DownloadIcon />}>
            경로 저장하기
          </CTA>
          <CTA variant="default" leftIcon={<SearchIcon />}>
            경로 검색하기
          </CTA>
          <CTA variant="tap">경로 저장하기</CTA>
          <CTA variant="tap" leftIcon={<StarOneIcon />}>
            즐겨찾기 추가
          </CTA>
          <CTA variant="tap" leftIcon={<WriteIcon />}>
            후기 작성하기
          </CTA>
          <CTA variant="default" disabled>
            경로 저장하기
          </CTA>
          <CTA variant="default" leftIcon={<DownloadIcon />} disabled>
            경로 저장하기
          </CTA>
        </div>
      </div>
    </div>
  ),
};
