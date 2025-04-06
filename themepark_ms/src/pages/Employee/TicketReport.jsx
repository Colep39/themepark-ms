import './TicketReport.css'
import { useState } from 'react';

export default function TicketReport() {
    const [reportPeriod, setReportPeriod] = useState('range');
    const [formData, setFormData] = useState({
        ticketType: '',
        userType: '',
        startDate: '',
        endDate: ''
    });

    const [results, setResults] = useState([]); // results that are generated from the paramters given in the form

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted report filters:', {
        reportPeriod,
        ...formData
        });
        // Mock "fetched" results
        const mockData = [
            {
            ticketId: 1,
            type: 'Adult',
            user: 'Visitor',
            date: '2025-03-01',
            amount: 20
            },
            {
            ticketId: 2,
            type: 'Senior',
            user: 'Staff',
            date: '2025-03-02',
            amount: 15
            }
        ];
        setResults(mockData);

        // TODO: Hook this up to a backend API or report generator
    };
    return (
        <>
            <div id="ticket-report-container">
                <h1 id="ticket-report-head">Ticket Report</h1>

                <form onSubmit={handleSubmit}>
                    <label>Report Period:</label>
                    <div className="report-period-buttons">
                        <button type="button" className={reportPeriod === 'range' ? 'active' : ''} onClick={() => handleReportPeriodChange('range')}>By Date Range</button>
                        <button type="button" className={reportPeriod === 'month' ? 'active' : ''} onClick={() => handleReportPeriodChange('month')}>By Month</button>
                        <button type="button" className={reportPeriod === 'year' ? 'active' : ''} onClick={() => handleReportPeriodChange('year')}>By Year</button>
                        <button type="button" className={reportPeriod === 'day' ? 'active' : ''} onClick={() => handleReportPeriodChange('day')}>Single Day</button>
                    </div>

                    <label>Ticket Type:</label>
                    <select name="ticketType" value={formData.ticketType} onChange={handleChange}>
                        <option value="">All Ticket Types</option>
                        <option value="adult">Adult</option>
                        <option value="season">Season</option>
                        <option value="youth">Youth</option>
                        <option value="child">Child</option>
                        <option value="senior">Senior</option>
                        <option value="student">Student</option>
                    </select>

                    <label>User Type:</label>
                    <select name="userType" value={formData.userType} onChange={handleChange}>
                        <option value="">All User Types</option>
                        <option value="staff">Staff</option>
                        <option value="visitor">Visitor</option>
                    </select>

                    {reportPeriod === 'range' && (
                        <>
                        <label>Start Date:</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />

                        <label>End Date:</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                        </>
                    )}

                    <button type="submit" className="generate-btn">Generate Report</button>
                </form>
                
                {/*Results Table*/}
                {results.length > 0 && (
                <div className="results-section">
                    <h4>Report Results</h4>
                    <table className="results-table">
                    <thead>
                        <tr>
                        <th>Ticket ID</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((ticket) => (
                        <tr key={ticket.ticketId}>
                            <td>{ticket.ticketId}</td>
                            <td>{ticket.type}</td>
                            <td>{ticket.user}</td>
                            <td>{ticket.date}</td>
                            <td>${ticket.amount}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
        </>
    )
}