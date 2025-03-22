import './ManageRides.css';
import AddRide from '/src/pages/components/AddRide.jsx'

export default function ManageRides(){

    const handleAddRide = () =>{
        console.log('Add Ride Button Clicked');
        // implement actions of a pop up to prompt the user to insert information of the new ride instance that they want
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
            </div>
        </>
    )
}