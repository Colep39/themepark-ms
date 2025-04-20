import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherReport.css';

const WeatherReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rideStats, setRideStats] = useState([]);
  const [topRidesData, setTopRidesData] = useState([]);
  const [mostPopularRideType, setMostPopularRideType] = useState("");
  const [mostPopularRideTypeCount, setMostPopularRideTypeCount] = useState(0);
  const [weatherAverages, setWeatherAverages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(formatDateForInput(firstDay));
    setEndDate(formatDateForInput(lastDay));
  }, []);

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchRideStats = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [rideRes, weatherRes] = await Promise.all([
        axios.get("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather/ride-counts-by-date-range", {
          params: { startDate, endDate }
        }),
        axios.get("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather/date-range-averages", {
          params: { start: startDate, end: endDate }
        })
      ]);

      const rideData = rideRes.data;
      const sortedRides = [...rideData].sort((a, b) => b.rideCount - a.rideCount);
      const top3Rides = sortedRides.slice(0, 3);

      const rideTypeCounts = {};
      rideData.forEach(r => {
        rideTypeCounts[r.rideType] = (rideTypeCounts[r.rideType] || 0) + r.rideCount;
      });

      const mostPopularType = Object.entries(rideTypeCounts).sort((a, b) => b[1] - a[1])[0] || ["Unknown", 0];

      setRideStats(rideData);
      setTopRidesData(top3Rides);
      setMostPopularRideType(mostPopularType[0]);
      setMostPopularRideTypeCount(mostPopularType[1]);
      setWeatherAverages(weatherRes.data[0]);
      setDataFetched(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRideStats();
  };

  return (
    <div className="weather-report-page">
      <div className="weather-report-container">
        <h1 className="report-title">Ride and Weather Report</h1>

        <form onSubmit={handleSubmit} className="date-selection-form">
          <div className="form-controls">
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="generate-button" disabled={loading}>
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>

        {loading ? (
          <div className="loading-container">
            <p>Loading data...</p>
          </div>
        ) : dataFetched ? (
          <>
            <div className="summary-section">
              <h2>Summary</h2>
              <div className="summary-grid">
                {/* Top 3 Rides */}
                <div className="summary-card">
                  <h3>Top 3 Rides</h3>
                  {topRidesData.length > 0 ? (
                    <ul className="top-rides-list">
                      {topRidesData.map((ride, idx) => (
                        <li key={idx}>
                          <span className="ride-name">{ride.rideName}</span> - {ride.rideCount} rides
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No data available for top rides.</p>
                  )}
                </div>

                {/* Most Popular Ride Type */}
                <div className="summary-card">
                  <h3>Most Popular Ride Type</h3>
                  {mostPopularRideType ? (
                    <p className="popular-type">
                      {mostPopularRideType} - {mostPopularRideTypeCount} rides
                    </p>
                  ) : (
                    <p className="no-data">No data available for ride types.</p>
                  )}
                </div>

                {/* Avg Temp */}
                <div className="summary-card">
                  <h3>Average Temperature</h3>
                  {weatherAverages ? (
                    <p style={{ color: "#111", fontWeight: "500" }}>
                      {weatherAverages.averageTemperature.toFixed(1)}°F
                    </p>
                  ) : (
                    <p className="no-data">No temperature data available.</p>
                  )}
                </div>

                {/* Rainout Days */}
                <div className="summary-card">
                  <h3>Rainout Days</h3>
                  {weatherAverages ? (
                    <p style={{ color: "#111", fontWeight: "500" }}>
                      {weatherAverages.averageRainouts}
                    </p>
                  ) : (
                    <p className="no-data">No rainout data available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h2>Ride Statistics</h2>
              {rideStats.length > 0 ? (
                <div className="table-container">
                  <table className="ride-stats-table">
                    <thead>
                      <tr>
                        <th>Ride Name</th>
                        <th>Ride Type</th>
                        <th>Ride Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rideStats.map((stat, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "row-even" : "row-odd"}>
                          <td>{stat.rideName}</td>
                          <td>{stat.rideType}</td>
                          <td>{stat.rideCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data-message">No ride statistics available for the selected date range.</p>
              )}
            </div>
          </>
        ) : (
          <div className="instructions">
            <p style={{ color: '#333' }}>Fill out the form and click "Generate Report" to see the data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherReport;
