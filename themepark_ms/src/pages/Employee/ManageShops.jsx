import './ManageShops.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddShopForm from './AddShopForm.jsx';

export default function ManageShops() {
    const [showNewItemForm, setShowNewItemForm] = useState(false);
    const [shopItems, setShopItems] = useState([]);
    const [editItem, setEditItem] = useState(null);

    const API_BASE_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/shop';

    useEffect(() => {
        fetchShopItems();
    }, []);

    const fetchShopItems = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setShopItems(response.data);
        } catch (error) {
            console.error("Error fetching shop items:", error);
            // Handle case when no items exist yet
            if (error.response?.status === 404) {
                setShopItems([]);
            }
        }
    };

    const handleAddItem = () => {
        setShowNewItemForm(true);
        setEditItem(null); // Clear any existing item for editing
    };

    const handleEditItem = (item) => {
        setShowNewItemForm(true);
        setEditItem(item); // Set the item to be edited
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${itemId}`);
            fetchShopItems(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting shop item:", error);
        }
    };

    const handleSubmitItem = async (formData) => {
        try {
            // Convert the status string to boolean for the API
            const statusBool = formData.status === "Available";
            
            // Match shop_name string to enum value format expected by backend
            // The backend expects 0 for Candy_Kingdom, 1 for Gourmet_Bites, 2 for Adventure_Gear
            // Map string shop names to their numeric enum values
            let shopNameEnum;
            switch(formData.shopName) {
                case "Candy Kingdom":
                    shopNameEnum = 0; // Corresponds to Candy_Kingdom
                    break;
                case "Gourmet Bites":
                    shopNameEnum = 1; // Corresponds to Gourmet_Bites
                    break;
                case "Adventure Gear":
                    shopNameEnum = 2; // Corresponds to Adventure_Gear
                    break;
                default:
                    shopNameEnum = 0; // Default to Candy_Kingdom
            }
            
            // Prepare the data for the API
            const payload = {
                item_name: formData.itemName,
                shop_name: shopNameEnum,  // Send numeric enum value
                item_price: parseInt(formData.price),
                status: statusBool,
                item_img: formData.item_img || null
            };
    
            console.log("Sending payload:", payload); // Log for debugging
    
            if (editItem) {
                // Include the shop_id for edit operations
                payload.shop_id = editItem.shop_id;
                await axios.put(`${API_BASE_URL}/${editItem.shop_id}`, payload);
            } else {
                // Add new item
                await axios.post(API_BASE_URL, payload);
            }
    
            setShowNewItemForm(false);
            fetchShopItems(); // Refresh the list after submission
        } catch (error) {
            // Enhanced error logging
            console.error("Error submitting shop item:", error);
            if (error.response) {
                console.error("Server responded with:", error.response.status, error.response.data);
            }
        }
    };

    return (
        <div className="ManageShopsContainer">
            <h1>Manage Shops</h1>
            <button id="add-shop-btn" onClick={handleAddItem}>Add New Shop Item</button>

            <div id="shops-table-container">
                <table id="shops-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Shop Name</th>
                            <th>Item Price</th>
                            <th>Item Image</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopItems.length > 0 ? (
                            shopItems.map((item) => (
                                <tr key={item.shop_id}>
                                    <td>{item.item_name}</td>
                                    <td>{item.shop_name}</td>
                                    <td>${item.item_price}</td>
                                    <td>
                                        {item.item_img ? (
                                            <img 
                                                src={item.item_img} 
                                                alt={item.item_name} 
                                                width="50" 
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td>{item.status ? "Available" : "Unavailable"}</td>
                                    <td>
                                        <button id="manage-shop-btn"onClick={() => handleEditItem(item)}>Edit</button>
                                        <button id="manage-shop-btn"onClick={() => handleDeleteItem(item.shop_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-items-message">No shop items found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showNewItemForm && (
                <AddShopForm
                    onClose={() => setShowNewItemForm(false)}
                    onSubmit={handleSubmitItem}
                    initialData={editItem}
                />
            )}
        </div>
    );
}