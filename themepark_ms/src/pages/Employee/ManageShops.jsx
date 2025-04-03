import './ManageShops.css';
import AddItem from '/src/pages/components/AddItem.jsx'
import AddShopForm from './AddShopForm.jsx'
import {useEffect, useState} from 'react';

/*
Reference: 

If the event is directly related to the component's DOM or internal state, keep it inside the component.
If the event affects things outside the component (like app-wide state, API calls, or routing), handle it where the component is used.
*/

export default function ManageShops(){

    const [showNewItemForm, setShowNewItemForm] = useState(false);
    const [items, setItems] = useState([]);

    const handleAddItem = () =>{
        console.log('Add Shop Item Button Clicked');
        setShowNewItemForm(true);
    }

    const handleSubmitNewItem = () => {
        alert("New Item Submmitted");
    }


    return (
        <>
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
                            <AddItem item="UmaZooma Hat" shop="Adventure Gear" price={10} image="null" status="Available"/>
                            <AddItem item="Speaking Lion" shop="Adventure Gear" price={25} image="null" status="Available" />
                            <AddItem item="Brisket" shop="Gourmet Bites" price={15} image="null" status="Available" />
                            <AddItem item="Churros" shop="Candy Kingdom" price={6} image="null" status="Unavailable" />

                        </tbody>
                    </table>
                </div>
                {showNewItemForm && (
                    <AddShopForm
                        onClose={() => setShowNewItemForm(false)}
                        onSubmit={handleSubmitNewItem}
                    />
                )}
            </div>
        </>
    )
}