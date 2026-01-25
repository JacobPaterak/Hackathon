// ===========================
// Dial.jsx (Reusable Component)
// ===========================
const Dial = ({ title, value, unit, color, maxValue }) => {
  const clampedValue = Math.min(Math.max(value, 0), maxValue);
  const degrees = (clampedValue / maxValue) * 180 - 90;

  return (
    <div className="dial-card">
      <h3>{title}</h3>
      <div className="gauge-wrapper">
        <div className="gauge-bg"></div>
        <div 
          className="gauge-fill" 
          style={{ backgroundColor: color }}
        ></div>
        <div 
          className="needle" 
          style={{ transform: `rotate(${degrees}deg)` }}
        ></div>
        <div className="needle-hub"></div>
      </div>
      <div className="readout">
        {clampedValue.toFixed(1)} <span className="unit">{unit}</span>
      </div>
    </div>
  );
};