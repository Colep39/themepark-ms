import './ManageBreakdowns.css'
import AddBreakdown from '/src/pages/components/AddBreakdown.jsx'
import {useEffect, useState} from 'react';
import AddBreakdownForm from './AddBreakdownForm.jsx'


export default function ManageBreakdowns(){

    const [showNewBreakdownForm, setShowNewBreakdownForm] = useState(false);
    const [breakdowns, setBreakdowns] = useState([]);

    const handleAddBreakdown = () =>{
        console.log('Add Breakdown Button Clicked');
        setShowNewBreakdownForm(true);
    }

    const handleSubmitNewBreakdown = () => {
        alert("New Breakdown Submmitted");
    }

    return (
        <>
            <div className="ManageBreakdownsContainer">
                <h1>Manage Breakdowns</h1>
                <button id="add-breakdown-btn" onClick={handleAddBreakdown}>Add New Breakdown</button>
                <div id="rides-table-container">
                    <table id="rides-table">
                        <thead>
                            <tr>
                                <th>Ride Name</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AddBreakdown name="Uma's Infinite Loop" date="2025-1-13" end="2025-5-6" description="A important part that makes the ride function properly busted, it was an expensive and rare part that may take long to obtain" status="Pending"/>
                        </tbody>
                    </table>
                </div>
                {showNewBreakdownForm && (
                    <AddBreakdownForm
                        onClose={() => setShowNewBreakdownForm(false)}
                        onSubmit={handleSubmitNewBreakdown}
                    />
                )}
            </div>
        </>
    )
}