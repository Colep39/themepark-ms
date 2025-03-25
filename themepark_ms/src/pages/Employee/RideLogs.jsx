import './RideLogs.css'
import RideLog from '/src/pages/components/RideLog.jsx'

export default function RideLogs() {
    return (
        <>
            <div className="RideLogsContainer">
                <h1>Ride Logs</h1>
                
                <div id="logs-table-container">
                    <table id="logs-table">
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Date</th>
                                <th>Ride Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <RideLog name="UmaPhobia" date="2025-3-06" count="84"/>
                            <RideLog name="Umapocalypse" date="2025-3-25" count="47" />
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}