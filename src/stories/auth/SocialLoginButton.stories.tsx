import type { Meta, StoryObj } from "@storybook/nextjs";

import GoogleLogo from "@/assets/images/auth/google-logo.svg";
import KakaoLogo from "@/assets/images/auth/kakao-logo.svg";
import NaverLogo from "@/assets/images/auth/naver-logo.svg";
import SocialLoginButton from "@/components/auth/SocialLoginButton";

const meta = {
  title: "Auth/SocialLoginButton",
  component: SocialLoginButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "카카오로 시작하기",
    className: "bg-[#FEE500] text-black/85",
    icon: <KakaoLogo width={18} height={16.8} />,
    onClick: () => {},
  },
  argTypes: {
    label: { control: "text" },
    icon: { control: false },
    onClick: { action: "clicked" },
  },
  decorators: [
    Story => (
      <div className="w-83.75">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SocialLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kakao: Story = {
  args: {
    label: "카카오로 시작하기",
    className: "bg-[#FEE500] text-black/85",
    icon: <KakaoLogo width={18} height={16.8} />,
  },
};

export const Naver: Story = {
  args: {
    label: "네이버로 시작하기",
    className: "bg-[#03A94D] text-white",
    icon: <NaverLogo width={16} height={16} />,
  },
};

export const Google: Story = {
  args: {
    label: "Google로 시작하기",
    className: "bg-white text-black",
    icon: <GoogleLogo width={20} height={20} />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-83.75 flex-col gap-4">
      <SocialLoginButton
        label="카카오로 시작하기"
        className="bg-[#FEE500] text-black/85"
        icon={<KakaoLogo width={18} height={16.8} />}
        onClick={() => {}}
      />
      <SocialLoginButton
        label="네이버로 시작하기"
        className="bg-[#03A94D] text-white"
        icon={<NaverLogo width={16} height={16} />}
        onClick={() => {}}
      />
      <SocialLoginButton
        label="Google로 시작하기"
        className="bg-white text-black"
        icon={<GoogleLogo width={20} height={20} />}
        onClick={() => {}}
      />
    </div>
  ),
};
