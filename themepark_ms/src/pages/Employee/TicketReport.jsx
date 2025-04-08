import './TicketReport.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TicketReport() {
    const [reportPeriod, setReportPeriod] = useState('range');
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: ''
    });

    const [results, setResults] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleReportPeriodChange = (type) => {
        setReportPeriod(type);
        setFormData((prev) => ({
            ...prev,
            startDate: '',
            endDate: ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const baseUrl = "https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ticket";

            // Fetch report data
            const reportResponse = await axios.get(`${baseUrl}/report`, {
                params: {
                    startDate: formData.startDate,
                    endDate: formData.endDate
                }
            });
            setResults(reportResponse.data);

            // Fetch statistics
            const statsResponse = await axios.get(`${baseUrl}/statistics`, {
                params: {
                    startDate: formData.startDate,
                    endDate: formData.endDate
                }
            });
            setStatistics(statsResponse.data);
        } catch (err) {
            setError('Failed to fetch ticket data. Please try again.');
            console.error('Error fetching ticket data:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="ticket-report-container">
            <h1 id="ticket-report-head">Ticket Report</h1>

            <form onSubmit={handleSubmit}>
                <div className="report-period-buttons">
                    <button
                        type="button"
                        className={reportPeriod === 'range' ? 'active' : ''}
                        onClick={() => handleReportPeriodChange('range')}
                    >
                        Date Range
                    </button>
                </div>

                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="generate-btn">
                    Generate Report
                </button>
            </form>

            {loading && <p>Loading report data...</p>}
            {error && <p className="error-message">{error}</p>}

            {statistics && (
                <div className="statistics-section">
                    <h2>Statistics</h2>
                    <p>Total Tickets: {statistics.TotalTickets}</p>
                    <p>Total Revenue: ${statistics.TotalRevenue.toFixed(2)}</p>
                    <h3>Tickets by Type:</h3>
                    <ul>
                        {Object.entries(statistics.TicketsByType).map(([type, count]) => (
                            <li key={type}>{type}: {count}</li>
                        ))}
                    </ul>
                </div>
            )}

            {results.length > 0 && (
                <div className="results-section">
                    <h2>Ticket Details</h2>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>User</th>
                                <th>Ride</th>
                                <th>Purchase Date</th>
                                <th>Type</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((ticket) => (
                                <tr key={ticket.TicketId}>
                                    <td>{ticket.TicketId}</td>
                                    <td>{ticket.UserName}</td>
                                    <td>{ticket.RideName}</td>
                                    <td>{new Date(ticket.PurchaseDate).toLocaleDateString()}</td>
                                    <td>{ticket.TicketType}</td>
                                    <td>${ticket.Price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}