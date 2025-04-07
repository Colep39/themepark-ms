import './AddUserForm.css'
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

export default function AddBreakdownForm({ onClose, onSubmit, initialData }){
    const [formData, setFormData] = useState({
        rideName: "",
        date: "",
        status: "Pending",
        description: ""
      });

      useEffect(() => {
        // If initialData is provided, set the form data
        if (initialData) {
            setFormData({
                rideName: initialData.ride_name || "",
                date: initialData.date || "",
                status: initialData.status || "Pending",
                description: initialData.description || ""
            });
        }
      }, [initialData])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare the payload with the correct field names for the API
        const payload = {
            ride_name: formData.rideName,
            date: formData.date,
            status: formData.status === "Pending" ? "pending" : "complete",
            description: formData.description
        };
        // If editing, include the breakdown ID
        if (initialData && initialData.breakdown_id) {
            payload.breakdown_id = initialData.breakdown_id;
        }

        await onSubmit(formData);
        console.log(formData);
        onClose();
    };
    
      return (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{initialData ? "Edit Breakdown" :  "Add New Breakdown"}</h2>
            <form onSubmit={handleSubmit}>
              <input name="rideName"  placeholder="Ride Name" onChange={handleChange} required />
              <textarea name="description"  placeholder="Description of the breakdown..." rows="4" cols="38" onChange={handleChange} required />
              <input name="date" type="date" onChange={handleChange} required />
              <select name="status" onChange={handleChange} value={formData.status} required>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
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