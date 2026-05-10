import { cn } from "@/lib/utils/cn";

type TagVariant = "gray" | "tag100" | "tag200" | "tag300" | "tag400" | "tag500";

const VARIANT_STYLES: Record<TagVariant, string> = {
  gray: "bg-gray-800 text-offwhite-400",
  tag100: "bg-tag-100 text-offwhite-400",
  tag200: "bg-tag-200 text-offwhite-400",
  tag300: "bg-tag-300 text-typo-primary",
  tag400: "bg-tag-400 text-white",
  tag500: "bg-tag-500 text-white",
};

const Tag = ({
  children,
  variant = "tag100",
  className,
}: {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-6 inline-flex h-7.5 w-fit cursor-default items-center px-1.5",
        VARIANT_STYLES[variant],
        className,
      )}>
      <div className="body-4 flex items-center gap-0.75 px-px [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0">
        {children}
      </div>
    </div>
  );
};

export default Tag;
