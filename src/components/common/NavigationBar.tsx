"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CalendarIcon, HomeIcon, MyPageIcon, ReportIcon, WriteIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/calendar", label: "캘린더", icon: CalendarIcon },
  { href: "/record", label: "기록", icon: WriteIcon },
  { href: "/report", label: "리포트", icon: ReportIcon, iconClassName: "size-8" },
  { href: "/my", label: "마이", icon: MyPageIcon },
];

interface NavigationBarProps {
  className?: string;
}

const NavigationBar = ({ className }: NavigationBarProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "rounded-t-20 flex w-full justify-between bg-gray-900 px-5 pt-3.75 pb-7.75 [border-top:0.4px_solid_var(--color-gray-800)]",
        className,
      )}>
      {NAV_ITEMS.map(({ href, label, icon: Icon, iconClassName = "size-6" }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center transition-all duration-300 hover:text-white",
              isActive ? "text-white" : "text-gray-700",
            )}>
            <span className="flex h-8 shrink-0 items-center justify-center px-2.5">
              <Icon className={iconClassName} />
            </span>
            <span className="body-4">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationBar;
