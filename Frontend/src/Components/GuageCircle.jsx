import "./GuageCircle.css";
export default function GaugeCircle({ value = 0 }) {
  // clamp 0..100
  const v = Math.max(0, Math.min(100, value));

  // map 0..100 to -120..120 degrees (nice gauge sweep)
  const angle = -120 + (v / 100) * 240;

  return (
    <div className="gauge">
      {/* fill ring */}
      <div
        className="gaugeRing"
        style={{
          background: `conic-gradient(#111 ${v * 3.6}deg, #e6e6e6 0deg)`,
        }}
      />

      {/* needle */}
      <div className="needle" style={{ transform: `rotate(${angle}deg)` }} />

      {/* optional number in middle */}
      <div className="gaugeValue">{v}%</div>
    </div>
  );
}
