import type { Meta, StoryObj } from "@storybook/nextjs";

import DownloadIcon from "@/assets/icons/icon_download.svg";
import PlusIcon from "@/assets/icons/icon_plus.svg";
import SearchIcon from "@/assets/icons/icon_search.svg";
import WriteIcon from "@/assets/icons/icon_write.svg";
import Button from "@/components/common/Button";

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

// ─── Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ─── Size · State (텍스트 전용) ────────────────────────────────────────────

export const LgDefault: Story = {
  name: "Lg — Default",
  args: { size: "lg", fullWidth: true },
};

export const LgPressed: Story = {
  name: "Lg — Pressed",
  args: { size: "lg", fullWidth: true, className: "bg-sea-blue-400/[.93]" },
};

export const LgDisabled: Story = {
  name: "Lg — Disabled",
  args: { size: "lg", fullWidth: true, disabled: true },
};

export const MdDefault: Story = {
  name: "Md — Default",
  args: { size: "md" },
};

export const MdPressed: Story = {
  name: "Md — Pressed",
  args: { size: "md", className: "bg-sea-blue-400/[.93]" },
};

export const MdDisabled: Story = {
  name: "Md — Disabled",
  args: { size: "md", disabled: true },
};

// ─── 아이콘 있는 버전 ─────────────────────────────────────────────────────

export const LgLeftIcon: Story = {
  name: "Lg — Left Icon",
  args: {
    size: "lg",
    fullWidth: true,
    leftIcon: <SearchIcon />,
    children: "경로 검색하기",
  },
};

export const LgRightIcon: Story = {
  name: "Lg — Right Icon",
  args: {
    size: "lg",
    fullWidth: true,
    rightIcon: <DownloadIcon />,
    children: "경로 저장하기",
  },
};

export const LgBothIcons: Story = {
  name: "Lg — Both Icons",
  args: {
    size: "lg",
    fullWidth: true,
    leftIcon: <PlusIcon />,
    rightIcon: <DownloadIcon />,
    children: "경로 추가 저장",
  },
};

export const MdLeftIcon: Story = {
  name: "Md — Left Icon",
  args: {
    size: "md",
    leftIcon: <WriteIcon />,
    children: "후기 작성하기",
  },
};

export const MdRightIcon: Story = {
  name: "Md — Right Icon",
  args: {
    size: "md",
    rightIcon: <SearchIcon />,
    children: "검색하기",
  },
};

export const MdBothIcons: Story = {
  name: "Md — Both Icons",
  args: {
    size: "md",
    leftIcon: <PlusIcon />,
    rightIcon: <DownloadIcon />,
    children: "추가 저장",
  },
};

// ─── 아이콘 · Disabled ─────────────────────────────────────────────────────

export const LgLeftIconDisabled: Story = {
  name: "Lg — Left Icon · Disabled",
  args: {
    size: "lg",
    fullWidth: true,
    leftIcon: <SearchIcon />,
    children: "경로 검색하기",
    disabled: true,
  },
};

export const MdLeftIconDisabled: Story = {
  name: "Md — Left Icon · Disabled",
  args: {
    size: "md",
    leftIcon: <WriteIcon />,
    children: "후기 작성하기",
    disabled: true,
  },
};

// ─── 전체 변형 모음 ────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "전체 변형 모음",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen bg-black p-10">
      <div className="rounded-8 border-sea-blue-300 mx-auto flex w-[888px] max-w-full flex-col gap-12 border border-dashed p-11">
        {/* Lg */}
        <section className="flex flex-col gap-4">
          <p className="body-3 text-offwhite-300">Lg</p>
          <div className="flex flex-col gap-3">
            <Button size="lg" fullWidth>
              텍스트 입력하기
            </Button>
            <Button size="lg" fullWidth className="bg-sea-blue-400/[.93]">
              텍스트 입력하기 (pressed)
            </Button>
            <Button size="lg" fullWidth disabled>
              텍스트 입력하기 (disabled)
            </Button>
            <Button size="lg" fullWidth leftIcon={<SearchIcon />}>
              경로 검색하기
            </Button>
            <Button size="lg" fullWidth rightIcon={<DownloadIcon />}>
              경로 저장하기
            </Button>
            <Button size="lg" fullWidth leftIcon={<PlusIcon />} rightIcon={<DownloadIcon />}>
              경로 추가 저장
            </Button>
            <Button size="lg" fullWidth leftIcon={<SearchIcon />} disabled>
              경로 검색하기 (disabled)
            </Button>
          </div>
        </section>

        {/* Md */}
        <section className="flex flex-col gap-4">
          <p className="body-3 text-offwhite-300">Md</p>
          <div className="flex flex-wrap gap-3">
            <Button size="md">텍스트 입력하기</Button>
            <Button size="md" className="bg-sea-blue-400/[.93]">
              텍스트 입력하기 (pressed)
            </Button>
            <Button size="md" disabled>
              텍스트 입력하기 (disabled)
            </Button>
            <Button size="md" leftIcon={<WriteIcon />}>
              후기 작성하기
            </Button>
            <Button size="md" rightIcon={<SearchIcon />}>
              검색하기
            </Button>
            <Button size="md" leftIcon={<PlusIcon />} rightIcon={<DownloadIcon />}>
              추가 저장
            </Button>
            <Button size="md" leftIcon={<WriteIcon />} disabled>
              후기 작성하기 (disabled)
            </Button>
          </div>
        </section>
      </div>
    </div>
  ),
};
