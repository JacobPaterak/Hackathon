import "./GuageCircle.css";
export default function GaugeCircle({ value = 0, size = 200 }) {
  const v = Math.max(0, Math.min(100, value));

  // SVG geometry (viewBox 0..100)
  const cx = 50;
  const cy = 50;
  const r = 40;

  const startDeg = -120;
  const sweepDeg = 240;

  const angleDeg = startDeg + (v / 100) * sweepDeg;
  const angleRad = (Math.PI / 180) * angleDeg;

  // Needle end point
  const needleLen = 30;
  const x2 = cx + needleLen * Math.cos(angleRad);
  const y2 = cy + needleLen * Math.sin(angleRad);

  // Arc lengths
  const C = 2 * Math.PI * r; // full circumference
  const arcLen = (sweepDeg / 360) * C; // length of the visible 240° arc
  const gapLen = C - arcLen; // hidden gap
  const progLen = (v / 100) * arcLen; // progress along the arc

  return (
    <div className="gauge" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="gaugeSvg">
        {/* background arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${gapLen}`}
          transform={`rotate(${startDeg} ${cx} ${cy})`}
        />

        {/* progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#111"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progLen} ${C}`}
          transform={`rotate(${startDeg} ${cx} ${cy})`}
          className="progress"
        />

        {/* needle */}
        <line
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          className="needle"
        />

        {/* center dot */}
        <circle cx={cx} cy={cy} r="4" fill="#111" />

        {/* value label */}
        <text x="50" y="56" dx="-18" textAnchor="middle" fontSize="16" fill="#111">
          {v}%
        </text>
      </svg>
    </div>
  );
}
