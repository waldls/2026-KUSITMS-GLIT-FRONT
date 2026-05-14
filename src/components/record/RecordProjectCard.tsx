import type { ReactNode } from "react";

import Tag from "@/components/common/Tag";
import { cn } from "@/lib/utils/cn";

interface RecordProjectCardProps {
  tag: string;
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  tagClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const RecordProjectCard = ({
  tag,
  title,
  children,
  rightSlot,
  className,
  tagClassName,
  titleClassName,
  contentClassName,
}: RecordProjectCardProps) => {
  return (
    <article className={cn("rounded-8 bg-gray-850 flex flex-col p-3.5 pr-3 pl-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <Tag variant="gray" className={tagClassName}>
          {tag}
        </Tag>
        {rightSlot}
      </div>

      <h3 className={cn("body-3 text-white", titleClassName)}>{title}</h3>

      <div className={cn("mt-4", contentClassName)}>{children}</div>
    </article>
  );
};

export default RecordProjectCard;
