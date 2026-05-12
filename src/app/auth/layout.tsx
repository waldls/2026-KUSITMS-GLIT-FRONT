import LoginBackground from "@/components/auth/LoginBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full">
      <LoginBackground />
      <div className="relative z-10 flex h-full flex-col px-5">{children}</div>
    </div>
  );
}
