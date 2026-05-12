"use client";

interface SocialLoginButtonProps {
  label: string;
  icon: React.ReactNode;
  className: string;
  onClick: () => void;
}

const SocialLoginButton = ({ label, icon, className, onClick }: SocialLoginButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-12 text-4 flex h-13.5 w-full cursor-pointer items-center justify-center gap-2 leading-[150%] font-semibold ${className}`}>
    {icon}
    {label}
  </button>
);

export default SocialLoginButton;
