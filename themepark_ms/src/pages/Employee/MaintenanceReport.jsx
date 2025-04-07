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
        setError('Could not load maintenance data.');
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
  const calculateTotalCost = () => {
    return filteredData.reduce((total, row) => total + (row.maintenanceCost || 0), 0);
  };

  // Calculate the average breakdowns per month in the time span
  const calculateAverageBreakdowns = () => {
    // Filter data based on the given start and end date
    const filtered = filteredData.filter((row) => {
      const start = new Date(row.startDate);
      const end = new Date(row.endDate);
      return start >= new Date(startDate) && end <= new Date(endDate);
    });

    if (filtered.length === 0) return 0;

    // Calculate the number of months in the given time span
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthsDifference = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

    // Calculate the average breakdowns per month
    const avgBreakdowns = filtered.length / (monthsDifference + 1); // Adding 1 because the range includes both start and end months
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
          <p><strong>Total Maintenance Cost: </strong>${calculateTotalCost().toFixed(2)}</p>
          <p><strong>Average Breakdowns Per Month: </strong>{calculateAverageBreakdowns()}</p>
        </div>

        {/* Render the filtered maintenance data table only if filtered data is available */}
        {filteredData.length > 0 && (
          <table className="maintenance-table">
            <thead>
              <tr>
                {/*<th>Maintenance ID</th>*/}
                {/*<th>Ride ID</th>*/}
                <th>Ride Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Maintenance Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {/*<td>{row.maintenance_id}</td>*/}
                  {/*<td>{row.ride_id}</td>*/}
                  <td>{getRideName(row.ride_id)}</td>
                  <td>{new Date(row.startDate).toLocaleDateString()}</td>
                  <td>{new Date(row.endDate).toLocaleDateString()}</td>
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
