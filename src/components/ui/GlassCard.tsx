import type { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "subtle" | "default" | "strong";
  as?: keyof React.JSX.IntrinsicElements;
}

function GlassCard({
  children,
  variant = "default",
  className = "",
  ...rest
}: GlassCardProps) {
  const variantClass =
    variant === "subtle"
      ? "glass-surface--subtle"
      : variant === "strong"
      ? "glass-surface--strong"
      : "glass-surface";

  return (
    <div className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export default GlassCard;
