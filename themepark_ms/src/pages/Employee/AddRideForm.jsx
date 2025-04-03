import './AddUserForm.css'
import { useState } from 'react';
import PropTypes from "prop-types";

export default function AddRideForm({ onClose, onSubmit }){
    const [formData, setFormData] = useState({
        rideName: "",
        type: "Standard",
        capacity: "",
        status: "Unavailable",
        thrillLevel: "",
        ride_img: ""
      });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
        onClose();
        console.log(formData);
      };
    
      return (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Add New Ride</h2>
            <form onSubmit={handleSubmit}>
              <input name="rideName"  placeholder="Ride Name" onChange={handleChange} required />
              <input name="capacity" type="number" placeholder="Capacity" min="5" onChange={handleChange} required />
              <input name="thrillLevel" type="number" placeholder="Thrill Level" min="1" max="5" onChange={handleChange} required />
              <select name="status" onChange={handleChange} value={formData.status} required>
                <option value="Unavailable">Unavailable</option>
                <option value="Available">Available</option>
              </select>
              <select name="type" onChange={handleChange} value={formData.type} required>
                <option value="Standard">Standard</option>
                <option value="Water">Water</option>
                <option value="Kid">Kid</option>
              </select>
              <input type="file" onChange={handleChange} name="ride_img" accept="image/*" required></input>
              <div className="modal-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      );
}

AddRideForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};