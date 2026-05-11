interface ProgressBarProps {
  /** Valor entre 0 e 100 */
  value: number;
  label?: string;
  helper?: string;
  variant?: "default" | "warm" | "cool";
}

function ProgressBar({
  value,
  label,
  helper,
  variant = "default",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-bar">
      <div className="progress-bar__track" aria-hidden="true">
        <div
          className={`progress-bar__fill progress-bar__fill--${variant}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="progress-bar__meta">
        {label && <span className="progress-bar__label">{label}</span>}
        {helper && <span className="progress-bar__helper">{helper}</span>}
      </div>
    </div>
  );
}

export default ProgressBar;
