import { useState, useEffect } from 'react';
import axios from 'axios';
import "./WeatherReport.css";

const WeatherReport = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);

  // Fetch all weather data on page load
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather/all');
        console.log('Fetched Weather Data:', response.data);
        setWeatherData(response.data);
        setFilteredData(response.data); // Initially show all data
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data');
      }
    };

    fetchWeatherData();
  }, []);

  // Handle the filter submission
  const handleFilterSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      const response = await axios.get(`https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather?start=${startDate}&end=${endDate}`);
      console.log('Fetched Filtered Weather Data:', response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching filtered weather data:', error);
      setError('Error fetching filtered weather data');
    }
  };

  // Process weather data for display (group by month and calculate rainouts)
  const processWeatherData = (data) => {
    const groupedData = {};

    data.forEach((entry) => {
      const month = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groupedData[month]) {
        groupedData[month] = { rainouts: 0, totalDays: 0 };
      }
      if (entry.rainOut) groupedData[month].rainouts += 1;
      groupedData[month].totalDays += 1;
    });

    // Calculate average rainouts
    const totalMonths = Object.keys(groupedData).length;
    const totalRainouts = Object.values(groupedData).reduce((sum, data) => sum + data.rainouts, 0);
    const averageRainouts = (totalRainouts / totalMonths).toFixed(2);

    return { groupedData, averageRainouts };
  };

  // Render the table
  const renderWeatherTable = () => {
    const { groupedData, averageRainouts } = processWeatherData(filteredData);

    return (
      <table className="weather-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Rainouts</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([month, data]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{data.rainouts}</td>
            </tr>
          ))}
          <tr className="average-row">
            <td><strong>Average</strong></td>
            <td>{averageRainouts}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="weather-report-container">
      <h1>Weather Report</h1>
      
      {/* Date Filter Inputs */}
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
        <button onClick={handleFilterSubmit} className="filter-button">Filter</button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Weather Data Table */}
      {renderWeatherTable()}
    </div>
  );
};

export default WeatherReport;
