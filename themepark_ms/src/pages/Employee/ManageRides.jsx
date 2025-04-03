import './ManageRides.css';
import AddRide from '/src/pages/components/AddRide.jsx'
import AddUserForm from './AddUserForm.jsx'
import AddRideForm from './AddRideForm.jsx'
import {useEffect, useState} from 'react';


export default function ManageRides(){
    const [showNewRideForm, setShowNewRideForm] = useState(false);
    const [rides, setRides] = useState([]);

    const handleAddRide = () =>{
        console.log('Add Ride Button Clicked');
        setShowNewRideForm(true);
    }

    const handleSubmitNewRide = () => {
        alert("New Ride Submmitted");
    }


    return (
        <>
            <div className="ManageRidesContainer">
                <h1>Manage Rides</h1>
                <button id="add-ride-btn" onClick={handleAddRide}>Add New Ride</button>
                
                {/* Table to display all rides */}
                <div id="rides-table-container">
                    <table id="rides-table">
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Thrill Level</th>
                                <th>Ride Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AddRide name="UmaCoaster 3000" type="Standard" capacity={20} status="Under Maintenance" thrill={5}/>
                            <AddRide name="OctomUma" type="Standard" capacity={30} status="Available" thrill={1} />
                            <AddRide name="UmaGeddon" type="Standard" capacity={12} status="Available" thrill={4} />
                        </tbody>
                    </table>
                </div>
                {showNewRideForm && (
                    <AddRideForm
                        onClose={() => setShowNewRideForm(false)}
                        onSubmit={handleSubmitNewRide}
                    />
                )}
            </div>
        </>
    )
}