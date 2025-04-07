import './ManageBreakdowns.css'
import AddBreakdown from '/src/pages/components/AddBreakdown.jsx'
import {useEffect, useState} from 'react';
import AddBreakdownForm from './AddBreakdownForm.jsx'
import axios from 'axios';


export default function ManageBreakdowns(){

    const [showNewBreakdownForm, setShowNewBreakdownForm] = useState(false);
    const [breakdowns, setBreakdowns] = useState([]);
    const [editBreakdown, setEditBreakdown] = useState(null);

    const API_BASE_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/maintenance';

    useEffect(() => {
        fetchBreakdowns();
    }, []);

    const fetchBreakdowns = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBreakdowns(data);
        } catch (error) {
            console.error('Error fetching breakdowns:', error);
        }
    }

    const handleAddBreakdown = () =>{
        console.log('Add Breakdown Button Clicked');
        setShowNewBreakdownForm(true);
        setEditBreakdown(null);
    }

    const handleEditbreakdown = (breakdown) => {
        setShowNewBreakdownForm(true);
        setEditBreakdown(breakdown);
    }

    const handleDeleteBreakdown = async (breakdownId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${breakdownId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchBreakdowns(); // Refresh the breakdowns list
        } catch (error) {
            console.error('Error deleting breakdown:', error);
        }
    }

    const handleSubmitNewBreakdown = async (breakdownData) => {
        try {
            if (editBreakdown) {
                // Debug: Log what we're sending in the PUT request
                console.log(`Sending PUT request to ${API_BASE_URL}/${editBreakdown.id}`, breakdownData);
                
                // Add ride_id to the payload for edit operations
                const editPayload = {
                    ...breakdownData,
                    id: editBreakdown.id // Include the ride_id in the payload
                };
                
                // PUT request to update the ride
                await axios.put(`${API_BASE_URL}/${editBreakdown.id}`, editPayload);
            } else {
                // Add new ride (POST)
                await axios.post(API_BASE_URL, breakdownData);
            }
            setShowNewBreakdownForm(false); // Hide form after submission
            fetchBreakdowns(); // Refresh the ride list
        } catch (error) {
            console.error("Error submitting breakdown:", error.response?.data || error.message);
            // Debug: Log the full error response
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                console.error("Response headers:", error.response.headers);
            }
        }
    };

    return (
        <>
            <div className="ManageBreakdownsContainer">
                <h1>Manage Breakdowns</h1>
                <button id="add-breakdown-btn" onClick={handleAddBreakdown}>Add New Breakdown</button>
                <div id="rides-table-container">
                    <table id="rides-table">
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AddBreakdown name="Uma's Infinite Loop" date="2025-1-13" end="2025-5-6" description="A important part that makes the ride function properly busted, it was an expensive and rare part that may take long to obtain" status="Pending"/>

                            {breakdowns.map((breakdown) => (
                                <tr key={breakdown.id}>
                                    <td>{breakdown.ride_name}</td>
                                    <td>{new Date(breakdown.date).toLocaleDateString()}</td>
                                    <td>{breakdown.description}</td>
                                    <td>{breakdown.status}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEditbreakdown(breakdown)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteBreakdown(breakdown.id)}>Delete</button>
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
    )
}