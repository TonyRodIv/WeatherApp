interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  className = "",
  style,
}: SkeletonProps) {
  return (
    <div
      className={`md-skeleton ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
