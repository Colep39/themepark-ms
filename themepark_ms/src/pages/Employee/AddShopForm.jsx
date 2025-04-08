import './AddUserForm.css';
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

export default function AddShopForm({ onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        shopName: "Candy Kingdom",
        itemName: "",
        price: "",
        status: "Available",
        item_img: null
    });

    // Set initial data if editing an item
    useEffect(() => {
        if (initialData) {
            setFormData({
                shopName: initialData.shop_name,
                itemName: initialData.item_name,
                price: initialData.item_price.toString(),
                status: initialData.status ? "Available" : "Unavailable",
                item_img: initialData.item_img || null
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value, type, files } = e.target;
      
      if (type === 'file' && files && files[0]) {
          // Handle file upload
          const reader = new FileReader();
          reader.onload = (event) => {
              const arrayBuffer = event.target.result;
              // Convert ArrayBuffer to byte array for backend compatibility
              const byteArray = Array.from(new Uint8Array(arrayBuffer));
              setFormData({ ...formData, item_img: byteArray });
          };
          reader.readAsArrayBuffer(files[0]);
      } else {
          setFormData({ ...formData, [name]: value });
      }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{initialData ? "Edit Shop Item" : "Add New Shop Item"}</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        name="itemName" 
                        placeholder="Item Name" 
                        value={formData.itemName}
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        name="price" 
                        type="number" 
                        placeholder="Price" 
                        value={formData.price}
                        min="0" 
                        onChange={handleChange} 
                        required 
                    />
                    <select 
                        name="status" 
                        onChange={handleChange} 
                        value={formData.status} 
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>
                    <select 
                        name="shopName" 
                        onChange={handleChange} 
                        value={formData.shopName} 
                        required
                    >
                        <option value="Candy Kingdom">Candy Kingdom</option>
                        <option value="Adventure Gear">Adventure Gear</option>
                        <option value="Gourmet Bites">Gourmet Bites</option>
                    </select>
                    <input 
                        type="file" 
                        onChange={handleChange} 
                        name="item_img" 
                        accept="image/*" 
                    />
                    {initialData && initialData.item_img && (
                        <div className="current-image">
                            <p>Current image:</p>
                            <img 
                                src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(initialData.item_img)))}`} 
                                alt="Current item" 
                                width="100" 
                            />
                        </div>
                    )}
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
    initialData: PropTypes.object
};