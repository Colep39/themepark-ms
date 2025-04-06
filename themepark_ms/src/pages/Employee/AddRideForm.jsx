import './AddUserForm.css';
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

export default function AddRideForm({ onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        rideName: "",
        type: "Standard",
        capacity: "",
        status: "Operational", // Default to Operational
        thrillLevel: "",
        ride_img: "",
        last_maintenance_date: "",
    });

    // Set initial data if editing a ride
    useEffect(() => {
        if (initialData) {
            console.log("Initial data received:", initialData); // Debug: Log initial data
            setFormData({
                rideName: initialData.ride_name,
                type: initialData.type,
                capacity: initialData.capacity,
                status: initialData.status === 'operational' ? 'Operational' : 'Maintenance',
                thrillLevel: initialData.thrill_level,
                ride_img: initialData.ride_img || "",
                last_maintenance_date: initialData.last_maintenance_date || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Special handling for file inputs
        if (type === 'file') {
            // Handle file upload - in a real app you'd process this
            // For now, just track the file selection
            setFormData({ ...formData, [name]: "file-selected" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set maintenance date if not provided
        const maintenanceDate = formData.last_maintenance_date || 
                               new Date().toISOString().split("T")[0]; // Format as "YYYY-MM-DD"

        // Prepare the payload with the correct field names for the API
        const payload = {
            ride_name: formData.rideName,
            capacity: parseInt(formData.capacity), 
            thrill_level: parseInt(formData.thrillLevel),
            status: formData.status === "Operational" ? "operational" : "maintenance",
            type: formData.type,
            // For edit operations, preserve existing values when possible
            maintenance_count: initialData?.maintenance_count || 0,
            last_maintenance_date: maintenanceDate,
            ride_img: formData.ride_img || null,
        };

        // Debug: Log the payload being sent
        console.log("Form payload:", payload);
        console.log("Is edit operation:", !!initialData);
        
        await onSubmit(payload);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{initialData ? "Edit Ride" : "Add New Ride"}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="rideName"
                        placeholder="Ride Name"
                        value={formData.rideName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="capacity"
                        type="number"
                        placeholder="Capacity"
                        value={formData.capacity}
                        min="5"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="thrillLevel"
                        type="number"
                        placeholder="Thrill Level"
                        value={formData.thrillLevel}
                        min="1"
                        max="5"
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="status"
                        onChange={handleChange}
                        value={formData.status}
                        required
                    >
                        <option value="Operational">Operational</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                    <select
                        name="type"
                        onChange={handleChange}
                        value={formData.type}
                        required
                    >
                        <option value="Standard">Standard</option>
                        <option value="Water">Water</option>
                        <option value="Kid">Kid</option>
                    </select>

                    <input
                        type="file"
                        onChange={handleChange}
                        name="ride_img"
                        accept="image/*"
                    />
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddRideForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object, // Allow initial data for editing
};