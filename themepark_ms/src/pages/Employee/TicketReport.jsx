import { useState, useEffect } from 'react';
import axios from 'axios';
import './TicketReport.css';

const TicketReport = () => {
  const [ticketData, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Azure deployment URL
  const baseUrl = "https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ticket";

  // Only fetch data when dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      handleFilterSubmit();
    }
  }, []); // Empty dependency array for initial render only

  const handleFilterSubmit = async () => {
    setError(null);
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      setLoading(true);
      const [reportResponse, statsResponse] = await Promise.all([
        axios.get(`${baseUrl}/report`, {
          params: { startDate, endDate }
        }),
        axios.get(`${baseUrl}/statistics`, {
          params: { startDate, endDate }
        })
      ]);

      setFilteredData(reportResponse.data);
      setStatistics(statsResponse.data);
      
      if (reportResponse.data.length === 0) {
        setError('No tickets found for the selected dates.');
      }
    } catch (err) {
      console.error('Error filtering ticket data:', err);
      setError('Could not filter ticket data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maintenance-report-page">
      <div className="maintenance-report-container">
        <h1>Ticket Report</h1>

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

        {loading && <p>Loading ticket data...</p>}
        {error && !loading && <p className="error-message">{error}</p>}

        {statistics && (
          <div className="statistics-container">
            <h2>Ticket Statistics</h2>
            <p>Total Tickets Sold: <strong>{statistics.totalTickets}</strong></p>
            <p>Total Revenue: <strong>${statistics.totalRevenue.toFixed(2)}</strong></p>
            {statistics.ticketsByType && Object.entries(statistics.ticketsByType).map(([type, count]) => (
              <p key={type}>{type} Tickets: <strong>{count}</strong></p>
            ))}
          </div>
        )}

        {filteredData.length > 0 && (
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>User Name</th>
                <th>Ride Name</th>
                <th>Purchase Date</th>
                <th>Ticket Type</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td>{ticket.ticketId}</td>
                  <td>{ticket.userName}</td>
                  <td>{ticket.rideName}</td>
                  <td>{new Date(ticket.purchaseDate).toLocaleDateString()}</td>
                  <td>{ticket.ticketType}</td>
                  <td>${ticket.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TicketReport;
