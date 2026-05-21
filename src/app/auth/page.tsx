import GlitLogo from "@/assets/images/auth/glit-logo.svg";
import LoginMockup from "@/assets/images/auth/login-mockup.svg";
import SocialLoginSection from "@/containers/auth/SocialLoginSection";

const Page = () => (
  <>
    <div className="flex-1" />

    <div className="flex flex-col items-center">
      <GlitLogo width={113} height={74} aria-label="글릿 로고" />
      <p className="body-3 mt-4 text-center text-white">기록할수록 선명해지는 나만의 커리어</p>
      <LoginMockup width={176} height={220} className="mt-8" aria-hidden />
    </div>

    <SocialLoginSection />

    <div className="flex-1" />
  </>
);

export default Page;
