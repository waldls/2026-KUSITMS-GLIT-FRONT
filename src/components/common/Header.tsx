import { cn } from "@/lib/utils";
import ChevronLeft from "@/assets/icons/icon_chevron_left.svg";

interface HeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  onLeftClick?: () => void;
  leftButtonAriaLabel?: string;
  className?: string;
}

const Header = ({
  title,
  leftIcon,
  onLeftClick,
  leftButtonAriaLabel = "뒤로 가기",
  className,
}: HeaderProps) => {
  const renderLeftIcon =
    leftIcon === undefined ? <ChevronLeft className="size-7 text-gray-100" /> : leftIcon;

  return (
    <header
      className={cn(
        "grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center bg-gray-900 px-4.5 py-4.25 text-white",
        className,
      )}>
      <div className="flex justify-start">
        {renderLeftIcon && (
          <button
            type="button"
            onClick={onLeftClick}
            disabled={!onLeftClick}
            aria-label={leftButtonAriaLabel}
            className="-ml-2 flex cursor-pointer items-center justify-center p-2 transition-opacity hover:opacity-80 disabled:cursor-not-allowed">
            {renderLeftIcon}
          </button>
        )}
      </div>

      <div className="flex justify-center">
        {title && <h1 className="head-4 truncate text-center">{title}</h1>}
      </div>
      <div />
    </header>
  );
};

export default Header;
