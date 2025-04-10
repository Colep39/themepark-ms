import './AddUserForm.css';
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

export default function AddBreakdownForm({ onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        rideId: "",
        startDate: "",
        endDate: "",
        status: "pending",
        description: "",
        maintenanceCost: 0
    });
    const [rides, setRides] = useState([]);
    const RIDES_API_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ride';

    useEffect(() => {
        axios.get(RIDES_API_URL)
            .then(response => setRides(response.data))
            .catch(error => console.error("Error fetching rides:", error));
    }, []);

    useEffect(() => {
      if (initialData) {
          setFormData({
              rideId: initialData.ride_id || "",
              startDate: formatDateForInput(initialData.startDate) || "",
              endDate: formatDateForInput(initialData.endDate) || "",
              // Fix this line - make sure you're checking for the number value
              // Update this section in the useEffect in AddBreakdownForm.jsx
status: initialData.status === 0 || initialData.status === "Complete" || 
initialData.status === "complete" ? "complete" : "pending",
              description: initialData.description || "",
              maintenanceCost: initialData.maintenanceCost || 0
          });
      }
  }, [initialData]);

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? parseInt(value) || 0 : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let endDate = formData.endDate;
        if (!endDate) {
            const calculatedEndDate = new Date(formData.startDate);
            calculatedEndDate.setDate(calculatedEndDate.getDate() + 7);
            endDate = calculatedEndDate.toISOString().split('T')[0];
        }

        const payload = {
          ride_id: parseInt(formData.rideId),
          startDate: formData.startDate,
          endDate: endDate,
          // Make sure this matches what the API expects
          status: formData.status === "complete" ? 0 : 1,
          description: formData.description,
          maintenanceCost: parseInt(formData.maintenanceCost) || 0
      };

        if (initialData?.maintenance_id) {
            payload.maintenance_id = initialData.maintenance_id;
        }

        await onSubmit(payload);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{initialData ? "Edit Maintenance" : "Add New Maintenance"}</h2>
                <form onSubmit={handleSubmit}>
                    <select name="rideId" value={formData.rideId} onChange={handleChange} required>
                        <option value="">Select a ride</option>
                        {rides.map(ride => (
                            <option key={ride.ride_id} value={ride.ride_id}>{ride.ride_name}</option>
                        ))}
                    </select>

                    <textarea
                        name="description"
                        placeholder="Description..."
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <div className="date-inputs">
                        <div>
                            <label htmlFor="startDate">Start Date:</label>
                            <input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="endDate">End Date:</label>
                            <input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                        </div>
                    </div>

                    <label htmlFor="maintenanceCost">Cost ($):</label>
                    <input id="maintenanceCost" name="maintenanceCost" type="number" min="0" value={formData.maintenanceCost} onChange={handleChange} required />

                    <select name="status" onChange={handleChange} value={formData.status} required>
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