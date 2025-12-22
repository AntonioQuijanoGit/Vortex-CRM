import React from "react";
import "./MiniLineChart.css";

export default function MiniLineChart({ data, width = 120, height = 40, color = "var(--color-success)", showPoints = true }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="mini-line-chart" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Area fill */}
        <path
          d={areaPath}
          fill={color}
          fillOpacity="0.1"
          className="mini-line-chart-area"
        />
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mini-line-chart-line"
        />
        {/* Points */}
        {showPoints && points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2.5"
            fill={color}
            className="mini-line-chart-point"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </svg>
    </div>
  );
}






