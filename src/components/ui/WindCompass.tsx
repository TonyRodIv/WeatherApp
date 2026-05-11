interface WindCompassProps {
  degrees: number;
  size?: number;
}

const DIRECTIONS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

export function degreesToCardinal(deg: number): string {
  const idx = Math.round(deg / 22.5) % 16;
  return DIRECTIONS[idx];
}

function WindCompass({ degrees, size = 56 }: WindCompassProps) {
  return (
    <div
      className="wind-compass"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="wind-compass__n">N</span>
      <span className="wind-compass__center" />
      <span
        className="wind-compass__pointer"
        style={{ transform: `translate(-50%, -100%) rotate(${degrees}deg)` }}
      />
    </div>
  );
}

export default WindCompass;
