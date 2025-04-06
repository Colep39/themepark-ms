import './AddUserForm.css'
import { useState } from 'react';
import PropTypes from "prop-types";

export default function AddBreakdownForm({ onClose, onSubmit }){
    const [formData, setFormData] = useState({
        rideName: "",
        date: "",
        status: "Pending",
        description: ""
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
            <h2>Add New Breakdown</h2>
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
};