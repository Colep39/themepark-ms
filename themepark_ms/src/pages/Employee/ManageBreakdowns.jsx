import './ManageBreakdowns.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddBreakdownForm from './AddBreakdownForm.jsx';

export default function ManageBreakdowns() {
    const [showForm, setShowForm] = useState(false);
    const [breakdowns, setBreakdowns] = useState([]);
    const [editData, setEditData] = useState(null);

    const API_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/maintenance';

    useEffect(() => {
        fetchBreakdowns();
    }, []);

    const fetchBreakdowns = async () => {
        try {
            const response = await axios.get(API_URL);
            setBreakdowns(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (editData) {
                await axios.put(`${API_URL}/${editData.maintenance_id}`, data);
            } else {
                await axios.post(API_URL, data);
            }
            fetchBreakdowns();
        } catch (error) {
            console.error('Error submitting record:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchBreakdowns();
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString();
    const getStatusText = (status) => {
        // If status is a number (from database)
        if (typeof status === 'number') {
            return status === 0 ? "Complete" : "Pending";
        }
        // If it's already a string
        return status;
    };
    
    return (
        <div className="ManageBreakdownsContainer">
            <h1>Manage Ride Maintenance</h1>
            <button onClick={() => { setShowForm(true); setEditData(null); }}>Add Maintenance</button>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Ride</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakdowns.map(b => (
                            <tr key={b.maintenance_id}>
                                <td>{b.ride?.ride_name || `#${b.ride_id}`}</td>
                                <td>{formatDate(b.startDate)}</td>
                                <td>{formatDate(b.endDate)}</td>
                                <td>{b.description}</td>
                                <td>{getStatusText(b.status)}</td>
                                <td>${b.maintenanceCost}</td>
                                <td>
                                    <button onClick={() => { setShowForm(true); setEditData(b); }}>Edit</button>
                                    <button onClick={() => handleDelete(b.maintenance_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <AddBreakdownForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleSubmit}
                    initialData={editData}
                />
            )}
        </div>
    );
}