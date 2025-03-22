import './ManageUsers.css'
import AddUser from '/src/pages/components/AddUser.jsx';

export default function ManageUsers() {

    const handleAddUser = () => {
        console.log('Add User Button Clicked');
    }

    return (
        <>
            
            <div className="ManageUsersContainer">
                <h1>Manage Users</h1>
                <button id="add-user-btn" onClick={handleAddUser}>Add New User</button>
                
                {/* Table to display all rides */}
                <div id="users-table-container">
                    <table id="users-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AddUser firstname="Ian" lastname="Hawke" username="lordcommander" status="Active" email="ianhawke@gmail.com" role="Admin"/>
                            <AddUser firstname="Cole" lastname="Plagens" username="cbplagen" status="Active" email="cbplagen@cougarnet.uh.edu" role="Staff" />
                            <AddUser firstname="Alyssa" lastname="Trejo" username="alyssatrejo" status="Active" email="alyssatrejo@gmail.com" role="Staff" />
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}