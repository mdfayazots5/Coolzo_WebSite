import type { ElementType, ReactNode } from "react";

/**
 * Section — the single source of vertical rhythm + background surface.
 * See Docs/Rules/Web_Responsive_Standard.md §4. Pair with Container for the
 * inner width. Never hard-code per-page section padding.
 */
interface SectionProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Vertical rhythm — see standard §4. */
  spacing?: "default" | "compact" | "loose" | "none";
  /** Background surface. */
  surface?: "transparent" | "cream" | "white" | "navy";
}

const SPACING: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  // Tighter on phones (less scroll), generous from md up.
  compact: "py-8 md:py-14",
  default: "py-12 md:py-24",
  loose: "py-16 md:py-32",
};

const SURFACE: Record<NonNullable<SectionProps["surface"]>, string> = {
  transparent: "",
  cream: "bg-brand-cream",
  white: "bg-white",
  navy: "bg-brand-navy text-brand-cream",
};

export default function Section({
  as: Tag = "section",
  children,
  className = "",
  spacing = "default",
  surface = "transparent",
}: SectionProps) {
  return (
    <Tag className={`${SPACING[spacing]} ${SURFACE[surface]} ${className}`}>
      {children}
    </Tag>
  );
}
