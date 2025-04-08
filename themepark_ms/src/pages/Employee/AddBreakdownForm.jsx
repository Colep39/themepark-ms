import './AddUserForm.css'
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

export default function AddBreakdownForm({ onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        rideName: "",
        rideId: "",
        startDate: "",
        endDate: "",
        status: "pending",
        description: "",
        maintenanceCost: 0
    });
    const [rides, setRides] = useState([]);
    const RIDES_API_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ride';

    // Fetch available rides
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(RIDES_API_URL);
                setRides(response.data);
            } catch (error) {
                console.error("Error fetching rides:", error);
            }
        };

        fetchRides();
    }, []);

    useEffect(() => {
        // If initialData is provided, set the form data
        if (initialData) {
            setFormData({
                rideName: initialData.ride?.ride_name || "",
                rideId: initialData.ride_id || "",
                startDate: formatDateForInput(initialData.startDate) || "",
                endDate: formatDateForInput(initialData.endDate) || "",
                status: initialData.status || "pending",
                description: initialData.description || "",
                maintenanceCost: initialData.maintenanceCost || 0
            });
        }
    }, [initialData]);

    // Helper function to format date for input field
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        if (typeof dateString === 'string') {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        }
        return dateString;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData({ ...formData, [name]: parseInt(value) || 0 });
        } else if (name === 'rideId') {
            // When ride is selected, update both rideId and rideName
            const selectedRide = rides.find(ride => ride.ride_id === parseInt(value));
            setFormData({ 
                ...formData, 
                rideId: parseInt(value),
                rideName: selectedRide ? selectedRide.ride_name : ""
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Calculate end date if not provided (one week from start date)
        const startDate = new Date(formData.startDate);
        let endDate = formData.endDate;
        if (!endDate) {
            const calculatedEndDate = new Date(startDate);
            calculatedEndDate.setDate(calculatedEndDate.getDate() + 7);
            endDate = calculatedEndDate.toISOString().split('T')[0];
        }
        
        // Prepare the payload with the correct field names for the API
        const payload = {
            ride_id: parseInt(formData.rideId),
            startDate: formData.startDate,
            endDate: endDate,
            status: formData.status === "complete" ? 0 : 1, // Using enum values: 0 for complete, 1 for pending
            description: formData.description,
            maintenanceCost: parseInt(formData.maintenanceCost) || 0
        };

        // If editing, include the maintenance ID
        if (initialData && initialData.maintenance_id) {
            payload.maintenance_id = initialData.maintenance_id;
        }

        console.log("Submitting maintenance data:", payload);
        await onSubmit(payload);
        
        // Update the ride status to maintenance if the breakdown is being added
        if (!initialData) {
            try {
                const selectedRide = rides.find(ride => ride.ride_id === parseInt(formData.rideId));
                if (selectedRide) {
                    const rideUpdatePayload = {
                        ...selectedRide,
                        status: "maintenance"
                    };
                    
                    await axios.put(`${RIDES_API_URL}/${selectedRide.ride_id}`, rideUpdatePayload);
                    console.log(`Updated ride status for ${formData.rideName} to maintenance`);
                }
            } catch (error) {
                console.error("Error updating ride status:", error);
            }
        }
        
        onClose();
    };
    
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{initialData ? "Edit Maintenance" : "Add New Maintenance"}</h2>
                <form onSubmit={handleSubmit}>
                    <select 
                        name="rideId" 
                        value={formData.rideId} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select a ride</option>
                        {rides.map(ride => (
                            <option key={ride.ride_id} value={ride.ride_id}>
                                {ride.ride_name}
                            </option>
                        ))}
                    </select>
                    
                    <textarea 
                        name="description" 
                        placeholder="Description of the maintenance..." 
                        rows="4" 
                        cols="38" 
                        value={formData.description}
                        onChange={handleChange} 
                        required 
                    />
                    
                    <div className="date-inputs">
                        <div>
                            <label htmlFor="startDate">Start Date:</label>
                            <input 
                                id="startDate"
                                name="startDate" 
                                type="date" 
                                value={formData.startDate}
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="endDate">End Date:</label>
                            <input 
                                id="endDate"
                                name="endDate" 
                                type="date" 
                                value={formData.endDate}
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="maintenanceCost">Maintenance Cost ($):</label>
                        <input 
                            id="maintenanceCost"
                            name="maintenanceCost" 
                            type="number" 
                            min="0"
                            placeholder="Maintenance Cost" 
                            value={formData.maintenanceCost}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <select 
                        name="status" 
                        onChange={handleChange} 
                        value={formData.status} 
                        required
                    >
                        <option value="pending">Pending</option>
                        <option value="complete">Complete</option>
                    </select>
                    
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddBreakdownForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object
};