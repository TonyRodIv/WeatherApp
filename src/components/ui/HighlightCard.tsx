import type { ReactNode } from "react";

interface HighlightCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function HighlightCard({
  title,
  children,
  className = "",
  style,
}: HighlightCardProps) {
  return (
    <article
      className={`highlight-card ${className}`.trim()}
      style={style}
    >
      <header className="highlight-card__header md-label-medium">{title}</header>
      <div className="highlight-card__body">{children}</div>
    </article>
  );
}

export default HighlightCard;
