import './ManageRides.css';
import AddRideForm from './AddRideForm.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageRides() {
    const [showRideForm, setShowRideForm] = useState(false);  
    const [rides, setRides] = useState([]);
    const [editRide, setEditRide] = useState(null);

    const API_BASE_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ride'; 

    useEffect(() => {
        fetchRides();
    }, []);

    const fetchRides = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setRides(response.data);
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    };

    const handleAddRide = () => {
        setShowRideForm(true); // Show form for adding a new ride
        setEditRide(null); // Clear any existing ride for editing
    };

    const handleEditRide = (ride) => {
        setShowRideForm(true); // Show form for editing
        setEditRide(ride); // Pass selected ride data to edit
        console.log("Editing ride:", ride); // Debug: Log the ride being edited
    };

    const handleDeleteRide = async (rideId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${rideId}`);
            fetchRides(); // Refresh rides after deletion
        } catch (error) {
            console.error("Error deleting ride:", error);
        }
    };

    const handleSubmitRide = async (rideData) => {
        try {
            if (editRide) {
                // Debug: Log what we're sending in the PUT request
                console.log(`Sending PUT request to ${API_BASE_URL}/${editRide.ride_id}`, rideData);
                
                // Add ride_id to the payload for edit operations
                const editPayload = {
                    ...rideData,
                    ride_id: editRide.ride_id // Include the ride_id in the payload
                };
                
                // PUT request to update the ride
                await axios.put(`${API_BASE_URL}/${editRide.ride_id}`, editPayload);
            } else {
                // Add new ride (POST)
                await axios.post(API_BASE_URL, rideData);
            }
            setShowRideForm(false); // Hide form after submission
            fetchRides(); // Refresh the ride list
        } catch (error) {
            console.error("Error submitting ride:", error.response?.data || error.message);
            // Debug: Log the full error response
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                console.error("Response headers:", error.response.headers);
            }
        }
    };

    return (
        <div className="ManageRidesContainer">
            <h1>Manage Rides</h1>
            <button id="add-ride-btn" onClick={handleAddRide}>Add New Ride</button>

            {/* Table to display all rides */}
            <div id="rides-table-container">
                <table id="rides-table">
                    <thead>
                        <tr>
                            <th>Ride Name</th>
                            <th>Type</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Thrill Level</th>
                            <th>Ride Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rides.map((ride) => (
                            <tr key={ride.ride_id}>
                                <td>{ride.ride_name}</td>
                                <td>{ride.type}</td>
                                <td>{ride.capacity}</td>
                                <td>{ride.status === 'operational' ? 'Operational' : 'Maintenance'}</td>
                                <td>{ride.thrill_level}</td>
                                <td>{ride.ride_img ? <img src={ride.ride_img} alt={ride.ride_name} width="50" /> : "No Image"}</td>
                                <td>
                                    <button className="ride-operation-btn" onClick={() => handleEditRide(ride)}>Edit</button>
                                    <button className="ride-operation-btn" onClick={() => handleDeleteRide(ride.ride_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showRideForm && (
                <AddRideForm
                    onClose={() => setShowRideForm(false)}
                    onSubmit={handleSubmitRide}
                    initialData={editRide} // Pass selected ride data for editing
                />
            )}
        </div>
    );
}