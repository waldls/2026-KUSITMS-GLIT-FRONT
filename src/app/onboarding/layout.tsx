import OnboardingBackground from "@/components/onboarding/OnboardingBackground";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <OnboardingBackground />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
};

export default Layout;
