import LoginBackground from "@/components/auth/LoginBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex size-full min-h-0 overflow-hidden bg-gray-900">
      <LoginBackground />
      <div className="relative z-10 flex min-h-0 w-full flex-col px-5">{children}</div>
    </div>
  );
}
