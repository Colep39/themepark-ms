import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherReport.css';

const WeatherReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState({
    topRides: [],
    mostPopularType: "",
    mostPopularTypeCount: 0,
    avgTemp: 0,
    totalRainouts: 0,
  });
  const [rideStats, setRideStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  // Set default dates to current month
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(formatDateForInput(firstDay));
    setEndDate(formatDateForInput(lastDay));
  }, []);

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const fetchRideStats = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather/ride-stats", {
        params: {
          startDate,
          endDate
        }
      });

      console.log("API Response:", response.data);
      
      // Process the popular type data which includes the count
      let popularType = "";
      let popularTypeCount = 0;
      
      if (response.data.mostPopularType) {
        // Extract the type and ride count - assuming the backend returns this data
        popularType = response.data.mostPopularType;
        
        // If the backend returns a totalRideCount for the most popular type
        popularTypeCount = response.data.mostPopularTypeCount || 0;
      }
      
      setSummary({
        topRides: response.data.topRides || [],
        mostPopularType: popularType,
        mostPopularTypeCount: popularTypeCount,
        avgTemp: response.data.avgTemp || 0,
        totalRainouts: response.data.totalRainouts || 0
      });
      
      setRideStats(response.data.rideStats || []);
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
      <h1 className="report-title">Ride & Weather Report</h1>
      
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
          
          <button 
            type="submit" 
            className="generate-button"
            disabled={loading}
          >
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
          {/* Summary Section */}
          <div className="summary-section">
            <h2>Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <h3>Top 3 Rides</h3>
                {summary.topRides.length > 0 ? (
                  <ul className="top-rides-list">
                    {summary.topRides.map((ride, idx) => (
                      <li key={idx}>
                        <span className="ride-name">{ride.rideName}</span> - {ride.totalRideCount} rides
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No data available</p>
                )}
              </div>
              
              <div className="summary-card">
                <h3>Most Popular Ride Type</h3>
                {summary.mostPopularType ? (
                  <p className="popular-type">
                    {summary.mostPopularType} - {summary.mostPopularTypeCount} rides
                  </p>
                ) : (
                  <p className="no-data">No data available</p>
                )}
              </div>
              
              <div className="summary-card">
                <h3>Average Temperature</h3>
                <p className="temperature">{summary.avgTemp}°F</p>
              </div>
              
              <div className="summary-card">
                <h3>Total Rainouts</h3>
                <p className="rainouts">{summary.totalRainouts}</p>
              </div>
            </div>
          </div>

          {/* Daily Stats Section */}
          <div className="stats-section">
      
            {rideStats.length > 0 ? (
              <div className="table-container">
                <table className="ride-stats-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ride Name</th>
                      <th>Type</th>
                      <th>Ride Count</th>
                      <th>Temperature (°F)</th>
                      <th>Rainout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rideStats.map((stat, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "row-even" : "row-odd"}>
                        <td>{formatDateForDisplay(stat.rideDate)}</td>
                        <td>{stat.rideName}</td>
                        <td>{stat.rideType}</td>
                        <td>{stat.rideCount}</td>
                        <td>{stat.temperature}</td>
                        <td>{stat.rainOut ? "Yes" : "No"}</td>
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
        </div>
      )}
    </div>
    </div>
  );
};

export default WeatherReport;