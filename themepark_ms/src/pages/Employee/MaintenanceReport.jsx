import { useState, useEffect } from 'react';
import axios from 'axios';
import './MaintenanceReport.css';

const MaintenanceReport = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [MaintenanceCost, setMaintenanceCost] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [totalCost, setTotalCost] = useState(0); // Track total cost
  const [avgBreakdowns, setAvgBreakdowns] = useState(0); // Track average breakdowns

  // Updated baseUrl for the production API
  const baseUrl = "https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/maintenance"; 

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}`);
        console.log('All Maintenance Data:', response.data);

        if (response.data && response.data.length > 0) {
          setMaintenanceData(response.data);
          setFilteredData(response.data);
        } else {
          setError('No maintenance data available.');
        }
      } catch (err) {
        console.error('Error loading maintenance data:', err);
        setError('Waiting to fetch maintenance data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRidesData = async () => {
      try {
        const rideResponse = await axios.get('https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ride');
        setRides(rideResponse.data);
      } catch (err) {
        console.error('Error loading ride data:', err);
        setError('Could not load ride data.');
      }
    };

    fetchMaintenanceData();
    fetchRidesData();
  }, []);

  const handleFilterSubmit = async () => {
    setError(null);
    if (!startDate && !endDate && !MaintenanceCost) {
      setFilteredData(maintenanceData); // No filters, show all
      setTotalCost(calculateTotalCost()); // Recalculate total cost
      setAvgBreakdowns(calculateAverageBreakdowns()); // Recalculate average breakdowns
      return;
    }

    try {
      let dateFilteredData = maintenanceData;
      let costFilteredData = maintenanceData;

      if (startDate && endDate) {
        const resDate = await axios.get(
          `${baseUrl}/MaintenanceByRange?startDate=${startDate}&endDate=${endDate}`
        );
        dateFilteredData = resDate.data;
      }

      if (MaintenanceCost) {
        const resCost = await axios.get(
          `${baseUrl}/MaintenanceByCost?MaintenanceCost=${Number(MaintenanceCost)}`
        );
        costFilteredData = resCost.data;
      }

      let combinedResults = [];
      if (startDate && endDate && MaintenanceCost) {
        const costIds = new Set(costFilteredData.map(record => record.maintenance_id));
        combinedResults = dateFilteredData.filter(record => costIds.has(record.maintenance_id));
      } else if (startDate && endDate) {
        combinedResults = dateFilteredData;
      } else if (MaintenanceCost) {
        combinedResults = costFilteredData;
      }

      setFilteredData(combinedResults);
      setTotalCost(calculateTotalCost(combinedResults)); // Recalculate total cost with filtered data
      setAvgBreakdowns(calculateAverageBreakdowns(combinedResults)); // Recalculate breakdowns with filtered data

      if (combinedResults.length === 0) {
        setError('No data found for the given filters.');
      }
    } catch (err) {
      console.error('Error filtering maintenance data:', err);
      setError('Could not filter maintenance data.');
    }
  };

  const getRideName = (rideId) => {
    const match = rides.find(ride => String(ride.ride_id).trim() === String(rideId).trim());
    return match ? match.ride_name : 'N/A';
  };

  // Calculate total maintenance cost for the filtered data
  const calculateTotalCost = (filtered = filteredData) => {
    return filtered.reduce((total, row) => total + (row.maintenanceCost || 0), 0);
  };

  const calculateAverageBreakdowns = (filtered = filteredData) => {
    if (!startDate || !endDate) return 0;
  
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
  
    if (rangeEnd < rangeStart) return 0;
  
    // Filter breakdowns that overlap the given range
    const filteredBreakdowns = filtered.filter((row) => {
      const breakdownStart = new Date(row.startDate);
      const breakdownEnd = new Date(row.endDate);
      return breakdownEnd >= rangeStart && breakdownStart <= rangeEnd;
    });
  
    // Now we calculate the unique months in which breakdowns occurred
    const monthsWithBreakdowns = new Set();

    filteredBreakdowns.forEach(row => {
      const breakdownStart = new Date(row.startDate);
      const breakdownEnd = new Date(row.endDate);

      // Add the start and end month (if they're within the range)
      monthsWithBreakdowns.add(`${breakdownStart.getFullYear()}-${breakdownStart.getMonth()}`);
      monthsWithBreakdowns.add(`${breakdownEnd.getFullYear()}-${breakdownEnd.getMonth()}`);
    });

    // The number of unique months where breakdowns occurred
    const monthsCount = monthsWithBreakdowns.size;

    if (monthsCount === 0) return 0;

    const avgBreakdowns = filteredBreakdowns.length / monthsCount;
    return avgBreakdowns.toFixed(2);
  };

  return (
    <div className="maintenance-report-page">
      <div className="maintenance-report-container">
        <h1>Maintenance Report</h1>

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
          <input
            type="number"
            value={MaintenanceCost}
            onChange={(e) => setMaintenanceCost(e.target.value)}
            placeholder="Cost"
          />
          <button onClick={handleFilterSubmit} className="filter-button">
            Filter
          </button>
        </div>

        {loading && <p>Loading maintenance data...</p>}
        {error && !loading && <p className="error-message">{error}</p>}

        <div className="statistics-container">
          <p><strong>Total Maintenance Cost: </strong>${totalCost.toFixed(2)}</p>
          <p><strong>Average Breakdowns Per Month: </strong>{avgBreakdowns}</p>
        </div>

        {/* Render the filtered maintenance data table only if filtered data is available */}
        {filteredData.length > 0 && (
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Ride Name</th>
                <th>Date</th>
                {/*<th>End Date</th>*/}
                <th>Description</th>
                <th>Status</th>
                <th>Maintenance Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{getRideName(row.ride_id)}</td>
                  <td>{new Date(row.startDate).toLocaleDateString()}</td>
                  {/*<td>{new Date(row.endDate).toLocaleDateString()}</td>*/}
                  <td>{row.description}</td>
                  <td>{row.status}</td>
                  <td>{row.maintenanceCost || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MaintenanceReport;
