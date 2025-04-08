import './ManageBreakdowns.css'
import AddBreakdown from '/src/pages/components/AddBreakdown.jsx'
import {useEffect, useState} from 'react';
import AddBreakdownForm from './AddBreakdownForm.jsx'
import axios from 'axios';

export default function ManageBreakdowns(){
    const [showNewBreakdownForm, setShowNewBreakdownForm] = useState(false);
    const [breakdowns, setBreakdowns] = useState([]);
    const [editBreakdown, setEditBreakdown] = useState(null);

    const API_BASE_URL = 'http://localhost:5171/api/maintenance';
    const RIDES_API_URL = 'http://localhost:5171/api/ride';

    useEffect(() => {
        fetchBreakdowns();
    }, []);

    const fetchBreakdowns = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setBreakdowns(response.data);
        } catch (error) {
            console.error('Error fetching maintenance records:', error);
        }
    }

    const handleAddBreakdown = () => {
        console.log('Add Maintenance Button Clicked');
        setShowNewBreakdownForm(true);
        setEditBreakdown(null);
    }

    const handleEditBreakdown = (breakdown) => {
        setShowNewBreakdownForm(true);
        setEditBreakdown(breakdown);
    }

    const handleDeleteBreakdown = async (breakdownId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${breakdownId}`);
            fetchBreakdowns(); // Refresh the breakdowns list
        } catch (error) {
            console.error('Error deleting maintenance record:', error);
        }
    }

    const updateRideStatus = async (rideId, status) => {
        try {
            // Get the ride details
            const ridesResponse = await axios.get(`${RIDES_API_URL}/${rideId}`);
            const ride = ridesResponse.data;
            
            if (ride) {
                // Update the ride status
                const rideUpdatePayload = {
                    ...ride,
                    status: status
                };
                
                await axios.put(`${RIDES_API_URL}/${rideId}`, rideUpdatePayload);
                console.log(`Updated ride status for ${ride.ride_name} to ${status}`);
            }
        } catch (error) {
            console.error('Error updating ride status:', error);
        }
    }

    const handleSubmitNewBreakdown = async (breakdownData) => {
        try {
            if (editBreakdown) {
                // Debug: Log what we're sending in the PUT request
                console.log(`Sending PUT request to ${API_BASE_URL}/${editBreakdown.maintenance_id}`, breakdownData);
                
                // PUT request to update the breakdown
                await axios.put(`${API_BASE_URL}/${editBreakdown.maintenance_id}`, breakdownData);
                
                // If status is changed to Complete, update the ride status to operational
                if (breakdownData.status === 0 && editBreakdown.status === 1) {
                    await updateRideStatus(breakdownData.ride_id, "operational");
                }
            } else {
                // Add new breakdown (POST)
                await axios.post(API_BASE_URL, breakdownData);
                // No need to update ride status here as it's handled in the AddBreakdownForm
            }
            
            setShowNewBreakdownForm(false); // Hide form after submission
            fetchBreakdowns(); // Refresh the breakdowns list
        } catch (error) {
            console.error("Error submitting maintenance record:", error.response?.data || error.message);
            // Debug: Log the full error response
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                console.error("Response headers:", error.response.headers);
            }
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Get status text
const getStatusText = (statusCode) => {
    return statusCode === 'complete' ? 'Complete' : 'Pending';
};


    return (
        <>
            <div className="ManageBreakdownsContainer">
                <h1>Manage Ride Maintenance</h1>
                <button id="add-breakdown-btn" onClick={handleAddBreakdown}>Add New Maintenance Record</button>
                <div id="rides-table-container">
                    <table id="rides-table">
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {breakdowns.map((breakdown) => (
                                <tr key={breakdown.maintenance_id}>
                                    <td>
                                        {breakdown.ride ? breakdown.ride.ride_name : `Ride #${breakdown.ride_id}`}
                                    </td>
                                    <td>{formatDate(breakdown.startDate)}</td>
                                    <td>{formatDate(breakdown.endDate)}</td>
                                    <td>{breakdown.description}</td>
                                    <td>{getStatusText(breakdown.status)}</td>
                                    <td>${breakdown.maintenanceCost}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEditBreakdown(breakdown)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteBreakdown(breakdown.maintenance_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showNewBreakdownForm && (
                    <AddBreakdownForm
                        onClose={() => setShowNewBreakdownForm(false)}
                        onSubmit={handleSubmitNewBreakdown}
                        initialData={editBreakdown}
                    />
                )}
            </div>
        </>
    );
}