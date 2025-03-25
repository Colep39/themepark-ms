import './Admin.css';
import {useEffect, useState} from 'react';
import './ManageUsers.css'
import AddUser from '/src/pages/components/AddUser.jsx';
import AddUserForm from './AddUserForm.jsx'

export default function Admin(){
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval); // Clean up
    }, []);

    /*
    // fetch users from the server 
    useEffect(() => {
        fetch("https://yourserver/api/users")
          .then((res) => res.json())
          .then((data) => setUsers(data))
          .catch((err) => console.error("Error fetching users:", err));
      }, []);
    */
    const handleAddUser = () => {
        console.log('Add User Button Clicked');
        setShowNewUserForm(true);
    }

    const handleSubmitNewUser = async (userData) => {
        try {
          const response = await fetch("https://yourserver/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
      
          if (!response.ok) {
            throw new Error("Failed to add user");
          }
      
          alert("User added successfully!");
          // You could refresh the user list here too
        } catch (err) {
          console.error(err);
          alert("Error adding user.");
        }
      };

    return (
        <>
            <div className="AdminContainer">
                <h1>Admin Dashboard</h1>
                <div className="admin-info">
                    <div id="admin-cell">
                    <h2>Tickets Sold Today</h2>
                    <p>83</p>
                    </div>
                    <div id="admin-cell">
                    <h2>Revenue Today</h2>
                    <p>$2457.69</p>
                    </div>
                    <div id="admin-cell">
                    <h2>Current Time</h2>
                    <p>{currentTime.toLocaleString()}</p>
                    </div>
                </div>

                {/*
                <div className="id-win-container">
                    <img src="./src/images/gojo-win.gif"></img>
                </div>
                */}

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
                                    <th>Birth Day</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AddUser firstname="Ian" lastname="Hawke" username="lordcommander" birth="1969-01-01" email="ianhawke@gmail.com" role="Admin"/>
                                <AddUser firstname="Cole" lastname="Plagens" username="cbplagen" birth="2003-07-09" email="cbplagen@cougarnet.uh.edu" role="Staff" />
                                <AddUser firstname="Alyssa" lastname="Trejo" username="alyssatrejo" birth="2004-05-26" email="alyssatrejo@gmail.com" role="Staff" />
                                {/*
                                {users.map((user, index) => (
                                    <AddUser
                                        key={index}
                                        firstname={user.firstName}
                                        lastname={user.lastName}
                                        username={user.username}
                                        email={user.email}
                                        role={user.role}
                                        birth={user.dateOfBirth}
                                    />
                                ))}
                                */}
                            </tbody>
                        </table>
                    </div>
                    {showNewUserForm && (
                    <AddUserForm
                        onClose={() => setShowNewUserForm(false)}
                        onSubmit={handleSubmitNewUser}
                    />
                    )}
                </div>
            </div>

        </>
    )
}