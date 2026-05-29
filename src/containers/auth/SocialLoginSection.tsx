"use client";

import GoogleLogo from "@/assets/images/auth/google-logo.svg";
import KakaoLogo from "@/assets/images/auth/kakao-logo.svg";
import NaverLogo from "@/assets/images/auth/naver-logo.svg";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import { loginWithSocial, SocialProvider } from "@/lib/apis/auth/auth";

const SOCIAL_PROVIDERS = [
  {
    provider: "kakao",
    label: "카카오로 시작하기",
    className: "bg-[#FEE500] text-black/85",
    icon: <KakaoLogo width={18} height={18} />,
  },
  {
    provider: "naver",
    label: "네이버로 시작하기",
    className: "bg-[#03A94D] text-white",
    icon: <NaverLogo width={16} height={16} />,
  },
  {
    provider: "google",
    label: "Google로 시작하기",
    className: "bg-white text-black",
    icon: <GoogleLogo width={20} height={20} />,
  },
] as const;

const SocialLoginSection = () => {
  const handleLogin = (provider: SocialProvider) => {
    loginWithSocial(provider);
  };

  return (
    <div className="mt-10 flex flex-col gap-4">
      {SOCIAL_PROVIDERS.map(({ provider, label, className, icon }) => (
        <SocialLoginButton
          key={provider}
          label={label}
          icon={icon}
          className={className}
          onClick={() => handleLogin(provider)}
        />
      ))}
      <a
        href="https://pie-adapter-6d6.notion.site/36edf277bb9880579bf2c487f834c58b"
        target="_blank"
        rel="noopener noreferrer"
        className="body-4 text-center text-gray-500">
        개인정보 처리방침
      </a>
    </div>
  );
};

export default SocialLoginSection;
