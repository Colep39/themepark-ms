import { useState, useEffect } from 'react';
import axios from 'axios';
import "./WeatherReport.css";

const WeatherReport = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredAverages, setFilteredAverages] = useState(null);
  const [error, setError] = useState(null);

  const baseUrl = "https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather";

  // Load monthly report on first render
  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get(`${baseUrl}/monthly-report`);
        console.log("Monthly Report:", response.data);
        setWeatherData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error("Error loading monthly report:", err);
        setError("Could not load monthly report.");
      }
    };

    fetchMonthlyReport();
  }, []);

  const handleFilterSubmit = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      // Get filtered data
      const res = await axios.get(`${baseUrl}/date-range?start=${startDate}&end=${endDate}`);
      console.log("Filtered:", res.data);
      setFilteredData(res.data);

      // Get filtered averages
      const avg = await axios.get(`${baseUrl}/date-range-averages?start=${startDate}&end=${endDate}`);
      console.log("Filtered Averages:", avg.data);
      setFilteredAverages(avg.data[0]); // SQL returns as array
      setError(null);
    } catch (err) {
      console.error("Error filtering:", err);
      setError("Could not filter data.");
    }
  };

  const renderWeatherTable = () => {
    if (!filteredData.length) return <p>No weather data to display.</p>;

    // Determine whether we are showing monthly data or filtered daily data
    const isMonthly = filteredData[0].monthYear !== undefined;

    const rows = isMonthly
      ? filteredData.map((entry, index) => ({
          key: index,
          month: entry.monthYear,
          rainouts: entry.rainouts,
          temp: entry.averageTemperature,
        }))
      : Object.entries(
          filteredData.reduce((acc, entry) => {
            const month = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[month]) acc[month] = { rainouts: 0, totalTemp: 0, count: 0 };
            if (entry.rainOut) acc[month].rainouts += 1;
            acc[month].totalTemp += entry.temperature;
            acc[month].count += 1;
            return acc;
          }, {})
        ).map(([month, data], index) => ({
          key: index,
          month,
          rainouts: data.rainouts,
          temp: (data.totalTemp / data.count).toFixed(2),
        }));
    
    const avgRainouts = filteredAverages
      ? filteredAverages.averageRainouts?.toFixed(2)
      : (
          rows.reduce((sum, r) => sum + Number(r.rainouts), 0) / rows.length
        ).toFixed(2);

    

    const avgTemp = filteredAverages
      ? filteredAverages.averageTemperature?.toFixed(2)
      : (
          rows.reduce((sum, r) => sum + Number(r.temp), 0) / rows.length
        ).toFixed(2);

    return (
      <div className="weather-table-container">
        <table className="weather-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Rainouts</th>
              <th>Avg Temp (°F)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>{row.month}</td>
                <td>{row.rainouts}</td>
                <td>{row.temp}</td>
              </tr>
            ))}
            <tr className="average-row">
              <td><strong>Average</strong></td>
              <td>{avgRainouts}</td>
              <td>{avgTemp}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="weather-report-page">
      <div className="weather-report-container">
        <h1>Weather Information</h1>
        <p>Reports Average Number of Rainouts and temperature per month and by total time span given</p>

        <div className="filter-container">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleFilterSubmit} className="filter-button">
            Filter
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {renderWeatherTable()}
      </div>
    </div>
  );
};

export default WeatherReport;
