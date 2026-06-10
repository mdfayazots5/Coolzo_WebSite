import type { ReactNode } from "react";

/**
 * Grid — predictable responsive card/list columns.
 * See Docs/Rules/Web_Responsive_Standard.md §6. Columns always collapse to a
 * single column on phones; never a fixed multi-column grid that overflows.
 */
interface GridProps {
  children: ReactNode;
  className?: string;
  /** Desktop column count; scales down responsively. */
  cols?: 2 | 3 | 4;
  gap?: "default" | "tight" | "loose";
}

const COLS: Record<NonNullable<GridProps["cols"]>, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const GAP: Record<NonNullable<GridProps["gap"]>, string> = {
  tight: "gap-4",
  default: "gap-6 lg:gap-8",
  loose: "gap-8 lg:gap-12",
};

export default function Grid({
  children,
  className = "",
  cols = 3,
  gap = "default",
}: GridProps) {
  return <div className={`grid ${COLS[cols]} ${GAP[gap]} ${className}`}>{children}</div>;
}
