import GlitLogo from "@/assets/images/auth/glit-logo.svg";
import LoginMockup from "@/assets/images/auth/login-mockup.svg";
import SocialLoginSection from "@/containers/auth/SocialLoginSection";

const Page = () => (
  <>
    <div className="flex-1" />
    <div className="flex flex-col items-center">
      <GlitLogo width={113} height={74} aria-label="글릿 로고" />
      <p className="body-3 mt-4 text-center text-white">기록할수록 선명해지는 나만의 커리어</p>
      <div className="relative mt-8">
        <div className="bg-sea-blue-100 absolute top-1/2 left-1/2 z-0 h-36.25 w-44.5 -translate-x-1/2 -translate-y-1/2 rotate-90 rounded-full opacity-40 blur-[17px]" />
        <LoginMockup width={170} height={208} className="relative z-1" aria-hidden />
      </div>
    </div>
    <SocialLoginSection />
    <div className="flex-1" />
  </>
);

export default Page;
