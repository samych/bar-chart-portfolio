
import { useEffect, useState } from "react";
import { csv } from "d3";
import Barplot from "./components/Barplot";
import "./App.css";
import WorldMap from "./components/WorldMap";
import DashboardStats from "./components/DashboardStats";


function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    csv(`${import.meta.env.BASE_URL}data/students.csv`, (d) => ({
      country: d.country,
      students: +d.students,
    })).then((loadedData) => {
      setData(loadedData);
    });
  }, []);
  return (
    <main className="dashboard">
      
<header>
  <span className="eyebrow">
    SAMY CHAHRI — DATA VISUALISATION
  </span>

  <h1>
    Making data <em>visible.</em>
  </h1>

  <p>
    Where are the students from?
    <br />
    Exploring the geographical distribution of students
    enrolled in the first cohort of the D3 + React course.
  </p>
</header>

{data.length > 0 && <DashboardStats data={data} />}
      <section className="chart-card">
        <h2>Students by country</h2>
        {data.length > 0 ? (
          <>
          <Barplot
            data={data}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />

          <WorldMap
            data={data}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
</>
        ) : (
          <p>Loading data...</p>
        )}
      </section>
    </main>
  );
}

export default App;
