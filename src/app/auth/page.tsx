"use client";

import GlitLogo from "@/assets/images/auth/glit-logo.svg";
import GoogleLogo from "@/assets/images/auth/google-logo.svg";
import KakaoLogo from "@/assets/images/auth/kakao-logo.svg";
import LoginMockup from "@/assets/images/auth/login-mockup.svg";
import NaverLogo from "@/assets/images/auth/naver-logo.svg";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import { loginWithSocial, SocialProvider } from "@/lib/apis/auth";

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

const Page = () => {
  const handleLogin = (provider: SocialProvider) => {
    loginWithSocial(provider);
  };

  return (
    <>
      <div className="flex-1" />

      <div className="flex flex-col items-center">
        <GlitLogo width={113} height={74} aria-label="글릿 로고" />
        <p className="body-3 text-sea-blue-700 mt-4 text-center">
          하루 5분, 오늘의 경험을 커리어 데이터로!
        </p>
        <LoginMockup width={176} height={220} className="mt-8" aria-hidden />
      </div>

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
        <p className="body-4 text-center text-gray-500">개인정보 처리방침</p>
      </div>

      <div className="flex-1" />
    </>
  );
};

export default Page;
