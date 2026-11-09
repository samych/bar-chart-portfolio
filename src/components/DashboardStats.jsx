
import { sum, max } from "d3";

export default function DashboardStats({ data }) {
  // Total number of students
  const totalStudents = sum(data, (d) => d.students);

  // Number of countries
  const totalCountries = data.length;

  // Country with the highest number of students
  const maxStudents = max(data, (d) => d.students);

  const topCountry = data.find(
    (d) => d.students === maxStudents
  );

  // Percentage of total students
  const topPercentage =
    totalStudents > 0
      ? ((maxStudents / totalStudents) * 100).toFixed(1)
      : "0.0";

  return (
    <section className="dashboard-stats">
      <div className="stat-card">
        <span className="stat-label">Total students</span>
        <strong className="stat-value">{totalStudents}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Countries</span>
        <strong className="stat-value">{totalCountries}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Largest share</span>
        <strong className="stat-value">
          {topPercentage}{"\u00A0"}%
        </strong>
        <span className="stat-detail">
          {topCountry?.country}
        </span>
      </div>
    </section>
  );
}
