import type { ElementType, ReactNode } from "react";

/**
 * Container — the single source of page width + horizontal gutters.
 * See Docs/Rules/Web_Responsive_Standard.md §3. Every public page wraps its
 * content in a Container instead of hard-coding max-width / padding.
 */
interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Content max-width. default=1280px, narrow=reading width, wide=1440px. */
  width?: "default" | "narrow" | "wide";
}

const WIDTHS: Record<NonNullable<ContainerProps["width"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
};

export default function Container({
  as: Tag = "div",
  children,
  className = "",
  width = "default",
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full ${WIDTHS[width]} px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
