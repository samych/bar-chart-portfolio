
import { scaleLinear, scaleBand, max, sum } from "d3";
import { useState } from "react";
import { countryCodes } from "../utils/countryCodes";
import { getTooltipPosition } from "../utils/tooltipPosition";



function Chart({
  data,
  mobile = false,
  selectedCountry,
  setSelectedCountry,
}) {
  // React: selected country
  

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [showTooltip, setShowTooltip] = useState(false);


  // Chart dimensions
  const width = mobile ? 400 : 900;
  const height = 720;

  const margin = {
    top: 10,
    right: mobile ? 35 : 60,
    bottom: 10,
    left: mobile ? 55 : 180,
  };

  // Sort countries by number of students
  const sortedData = [...data].sort(
    (a, b) => b.students - a.students
  );

  // Calculate total students
  const totalStudents = sum(data, (d) => d.students);

  // Calculate chart dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // D3: horizontal scale
  const xScale = scaleLinear()
    .domain([
      0,
      max(sortedData, (d) => d.students) ?? 0,
    ])
    .range([0, innerWidth - 20]);

  // D3: vertical scale
  const yScale = scaleBand()
    .domain(sortedData.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.25);

  const selectedData = data.find(
    (d) => countryCodes[d.country] === selectedCountry
  );

  const percentage = selectedData && totalStudents > 0
  ? ((selectedData.students / totalStudents) * 100).toFixed(1)
  : null;


  const updateTooltipPosition = (event) => {
    setTooltipPosition(getTooltipPosition(event));
  };


return (
  <div className="chart-interactive">
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Students by country, sorted in descending order"
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
      {sortedData.map((d) => {
          const y = yScale(d.country);
          const barWidth = xScale(d.students);
          const centerY =
            y + yScale.bandwidth() / 2;

          const label = mobile
            ? countryCodes[d.country] ?? d.country
            : d.country;

          return (
            <g key={d.country}>
              <text
                x={-12}
                y={centerY}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#f3f1ec"
                fontSize={12}
              >
                {label}
              </text>

              <rect
              x={0}
              y={y}
              width={barWidth}
              height={yScale.bandwidth()}
              fill={
              selectedCountry === countryCodes[d.country]
                ? "#ff9b78"
                : "#f07955"
              }
              rx={3}
              className="interactive-bar"
              onMouseEnter={(event) => {
                setSelectedCountry(countryCodes[d.country]);
                setShowTooltip(true);
                updateTooltipPosition(event);
              }}
              onMouseMove={updateTooltipPosition}
              onMouseLeave={() => {
                setSelectedCountry(null);
                setShowTooltip(false);
              }}
              
              onClick={(event) => {
                setSelectedCountry(countryCodes[d.country]);
                setShowTooltip(true);
                updateTooltipPosition(event);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedCountry(countryCodes[d.country]);
                  setShowTooltip(true);
                  updateTooltipPosition(event);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${d.country}: ${d.students} students`}
              onFocus={(event) => {
                setSelectedCountry(countryCodes[d.country]);
                setShowTooltip(true);
                updateTooltipPosition(event);
              }}
              onBlur={() => {
                setSelectedCountry(null);
                setShowTooltip(false);
              }}
              />


              <text
                x={barWidth + 10}
                y={centerY}
                dominantBaseline="middle"
                fill="#f3f1ec"
                fontSize={12}
                fontWeight={600}
              >
                {d.students}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
    
    {selectedData && showTooltip && (
      <div
        className="chart-tooltip"
        role="status"
        style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: "translateY(-50%)",
      }}
      >
        <strong>{selectedData.country}</strong>
        <span>
          {selectedData.students} students ({percentage}{"\u00A0"}%)
        </span>
      </div>
    )}
  </div>
);
}


export default function Barplot({
  data,
  selectedCountry,
  setSelectedCountry,
}) {
  return (
    <div className="barplot">
      <div className="barplot-desktop">
        <Chart data={data}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}/>
      </div>

      <div className="barplot-mobile">
        <Chart data={data}
        mobile
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry} />

        <div className="country-legend">
          <h3>Country codes</h3>

          <div className="country-legend-grid">
            {data.map((d) => (
              <div
                className="country-legend-item"
                key={d.country}
              >
                <span className="country-code">
                  {countryCodes[d.country] ?? "—"}
                </span>

                <span>{d.country}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
