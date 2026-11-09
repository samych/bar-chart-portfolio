
import { useEffect, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { scaleThreshold } from "d3-scale";
import { countryCodes } from "../utils/countryCodes";
import { getTooltipPosition } from "../utils/tooltipPosition";



const legendClasses = [
  ["1–4", "#fbd4c6"],
  ["5–9", "#f7ae96"],
  ["10–19", "#f07955"],
  ["20–39", "#d85c3e"],
  ["40+", "#a83927"],
  ["No data", "#30363d"],
];

export default function WorldMap({
  data,
  selectedCountry,
  setSelectedCountry,
}) {
  const [coastline, setCoastline] = useState(null);
  const [countries, setCountries] = useState(null);
  const [inland, setInland] = useState(null);

  
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  });

  const width = 900;
  const height = 500;

  useEffect(() => {
    let active = true;
    const base = `${import.meta.env.BASE_URL}data/`;
    const loadGeoJSON = async (file) => {
      const response = await fetch(`${base}${file}`);
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.json();
    };

    Promise.all([
      loadGeoJSON("CNTR_BN_20M_2024_4326_COASTL.geojson"),
      loadGeoJSON("CNTR_RG_20M_2024_4326.geojson"),
      loadGeoJSON("CNTR_BN_20M_2024_4326_INLAND.geojson"),
    ])
      .then(([coast, regions, borders]) => {
        if (!active) return;
        setCoastline(coast);
        setCountries(regions);
        setInland(borders);
      })
      .catch((error) => {
        if (active) console.error("Map loading error:", error);
      });

    return () => { active = false; };
  }, []);

  // Projection and SVG path generator
  const projection = geoNaturalEarth1()
    .fitSize([width, height], { type: "Sphere" });

  const path = geoPath(projection);

  // CSV → GISCO data join
  const studentsByCountry = new Map(
    data.map((d) => [countryCodes[d.country], d.students])
  );
  const countryNamesByCode = new Map(
    data.map((d) => [countryCodes[d.country], d.country])
  );

  // Threshold color scale
  const colorScale = scaleThreshold()
    .domain([5, 10, 20, 40])
    .range([
      "#fbd4c6",
      "#f7ae96",
      "#f07955",
      "#d85c3e",
      "#a83927",
    ]);

  // Total students
  const totalStudents = data.reduce(
    (total, d) => total + d.students,
    0
  );

  // Selected country data
  const selectedData = data.find(
    (d) => countryCodes[d.country] === selectedCountry
  );

  const percentage =
    selectedData && totalStudents > 0
      ? ((selectedData.students / totalStudents) * 100).toFixed(1)
      : null;

  // The same positioning logic is shared with the bar chart.
  const updateTooltipPosition = (event) => {
    setTooltipPosition(getTooltipPosition(event));
  };

  const [showTooltip, setShowTooltip] = useState(false);

  if (!coastline || !countries || !inland) {
    return <p>Loading map...</p>;
  }

  return (
    <div className="world-map">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="World map showing students by country"
      >
        {/* 1. Coastline */}
        <g fill="none" stroke="#2b3840" strokeWidth={1.5}>
          {coastline.features.map((feature, i) => (
            <path key={i} d={path(feature)} />
          ))}
        </g>

        {/* 2. Choropleth */}
        <g stroke="none">
          {countries.features.map((feature, i) => {
            const code = feature.properties.CNTR_ID;
            const students = studentsByCountry.get(code);
            const isSelected = selectedCountry === code;

            return (
              <path
                key={i}
                d={path(feature)}
                fill={
                  students === undefined
                    ? "#30363d"
                    : colorScale(students)
                }
                opacity={isSelected ? 0.7 : 1}
                onMouseEnter={(event) => {
                if (students === undefined) return;

                setSelectedCountry(code);
                setShowTooltip(true);
                updateTooltipPosition(event);
                }}
                onMouseMove={(event) => {
                if (students !== undefined) {
                    updateTooltipPosition(event);
                }
                }}
                onMouseLeave={() => {
                  setSelectedCountry(null);
                  setShowTooltip(false);
                }}
                tabIndex={students === undefined ? undefined : 0}
                role={students === undefined ? undefined : "button"}
                aria-label={students === undefined ? undefined : `${countryNamesByCode.get(code)}: ${students} students`}
                onFocus={(event) => {
                  if (students === undefined) return;
                  setSelectedCountry(code);
                  setShowTooltip(true);
                  updateTooltipPosition(event);
                }}
                onBlur={() => {
                  setSelectedCountry(null);
                  setShowTooltip(false);
                }}
                onKeyDown={(event) => {
                  if (students === undefined) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedCountry(code);
                    setShowTooltip(true);
                    updateTooltipPosition(event);
                  }
                }}
                
              />
            );
          })}
        </g>

        {/* 3. Inland boundaries */}
        <g fill="none" stroke="#5e6970" strokeWidth={0.5} pointerEvents="none">
          {inland.features.map((feature, i) => (
            <path key={i} d={path(feature)} />
          ))}
        </g>
      </svg>


        {/* Floating tooltip */}
        {selectedData && showTooltip && (
        <div
            className="map-tooltip"
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


      {/* Map legend */}
      <div className="map-legend">
        <span className="map-legend-title">
          Number of students
        </span>

        <div className="map-legend-items">
          {legendClasses.map(([label, color]) => (
            <div className="map-legend-item" key={label}>
              <span
                className="map-legend-swatch"
                style={{ backgroundColor: color }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
