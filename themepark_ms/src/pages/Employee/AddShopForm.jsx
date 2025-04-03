import './AddUserForm.css'
import { useState } from 'react';
import PropTypes from "prop-types";

export default function AddShopForm({ onClose, onSubmit }){
    const [formData, setFormData] = useState({
        shopName: "Candy Kingdom",
        itemName: "",
        price: "",
        status: "Available",
        item_img: ""
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
            <h2>Add New Shop Item</h2>
            <form onSubmit={handleSubmit}>
              <input name="itemName"  placeholder="Item Name" onChange={handleChange} required />
              <input name="price" type="number" placeholder="Price" min="0" onChange={handleChange} required />
              <select name="status" onChange={handleChange} value={formData.status} required>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <select name="shopName" onChange={handleChange} value={formData.shopName} required>
                <option value="Candy Kingdom">Candy Kingdom</option>
                <option value="Adventure Gear">Adventure Gear</option>
                <option value="Gourmet Bites">Gourmet Bites</option>
              </select>
              <input type="file" onChange={handleChange} name="item_img" accept="image/*" required></input>
              <div className="modal-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      );
}

AddShopForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};