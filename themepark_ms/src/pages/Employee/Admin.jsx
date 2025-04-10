import './Admin.css';
import { useEffect, useState, useMemo } from 'react';
import './ManageUsers.css';
import AddUserForm from './AddUserForm.jsx';
import EditUserForm from './EditUserForm2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Admin() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const token = localStorage.getItem("token");

    // Filter/Sort state
    const [roleFilter, setRoleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'last_name',
        direction: 'asc'
    });

    // Processed users
    const processedUsers = useMemo(() => {
        let result = [...users];

        // Filter by role
        if (roleFilter !== 'All') {
            result = result.filter(user => user.role === roleFilter);
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user => 
                user.first_name.toLowerCase().includes(term) ||
                user.last_name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );
        }

        // Sorting
        result.sort((a, b) => {
            if (sortConfig.key === 'last_name') {
                const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
                const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
                return sortConfig.direction === 'asc' 
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            }
            else if (sortConfig.key === 'birth_date') {
                const dateA = new Date(a.birth_date);
                const dateB = new Date(b.birth_date);
                return sortConfig.direction === 'asc' 
                    ? dateA - dateB 
                    : dateB - dateA;
            }
            else if (sortConfig.key === 'role') {
                return sortConfig.direction === 'asc'
                    ? a.role.localeCompare(b.role)
                    : b.role.localeCompare(a.role);
            }
            return 0;
        });

        return result;
    }, [users, roleFilter, searchTerm, sortConfig]);

    // Time updater
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => { 
        fetchUsers(); 
    }, []);

    // Add user handler
    const handleSubmitNewUser = async (userData) => {
        try {
            const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error("Failed to add user");

            if (response.ok) {
                toast.success("✅ Employee has been added");
                // optionally refresh your table or close modal here
            }
            
            fetchUsers();
            setShowNewUserForm(false);
        } catch (err) {
            console.error("Error adding user:", err);
            toast.error("❌ Failed to add employee");
        }
    };

    // Delete user handler
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            const response = await fetch(`https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete user");
            
            if (response.ok) {
                toast.success("🗑️ Employee has been deleted");
            }
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("❌ Failed to delete employee");
        }
    };

    // Edit user handlers
    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowNewUserForm(true);
    };

    const handleUpdateUser = async (userData) => {
        try {
            // Create the payload with user_id
            const payload = {
                user_id: editingUser.user_id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                birth_date: userData.birth_date ? 
                    new Date(userData.birth_date).toISOString() : 
                    null,
                username: userData.username,
                role: userData.role,
                ...(userData.password && { password: userData.password })
            };
    
            const response = await fetch(`https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/users/${editingUser.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update user");
            
            if (response.ok) {
                toast.success("✏️ Employee has been updated");
            }
            fetchUsers();
            setShowNewUserForm(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("❌ Admin limit reached. Demote an admin to add another.");
        }
    };

    // Sort handler
    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Render
    return  (
        <div className="admin-page">
            <div className="AdminContainer">
                
                {/*
                <div className="admin-info">
                    <div id="admin-cell"><h2>Tickets Sold Today</h2><p>83</p></div>
                    <div id="admin-cell"><h2>Revenue Today</h2><p>$2457.69</p></div>
                    <div id="admin-cell"><h2>Current Time</h2><p>{currentTime.toLocaleString()}</p></div>
                </div>
                */}

                <div className="nah-id-win-container">
                    <img src="/images/coogs.gif" alt="Coogs" className="coogs" />
                    {/*<img src="public/images/NAH_I_D_WIN.gif" alt="Nah ID Win" className="gojo" /> */}
                    <h1>Admin Dashboard</h1>
                    <img src="/images/basketball.gif" alt="Basketball" className="basketball" />
                </div>
                
                <div className="ManageUsersContainer">
                    <div className="controls-row">
                        <h1>Manage Users</h1>
                        <button id="add-user-btn" onClick={() => {
                            setEditingUser(null);
                            setShowNewUserForm(true);
                        }}>
                            Add New User
                        </button>
                    </div>
        
                    {/* NEW: Filter/Search Controls */}
                    <div className="filter-controls">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
        
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            <option value="Admin">Admins</option>
                            <option value="Staff">Staff</option>
                            <option value="Visitor">Visitors</option>
                        </select>
        
                        <div className="sort-buttons">
                            <button onClick={() => requestSort('last_name')}>
                                Sort by Name {sortConfig.key === 'last_name' && (
                                    <span>({sortConfig.direction === 'asc' ? '↑' : '↓'})</span>
                                )}
                            </button>
                            <button onClick={() => requestSort('birth_date')}>
                                Sort by Age {sortConfig.key === 'birth_date' && (
                                    <span>({sortConfig.direction === 'asc' ? '↑' : '↓'})</span>
                                )}
                            </button>
                            <button onClick={() => requestSort('role')}>
                                Sort by Role {sortConfig.key === 'role' && (
                                    <span>({sortConfig.direction === 'asc' ? '↑' : '↓'})</span>
                                )}
                            </button>
                        </div>
                    </div>
        
                    {/* Users Table */}
                    <div id="users-table-container">
                        <table id="users-table">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Birth Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedUsers.length > 0 ? (
                                    processedUsers.map((user) => (
                                        <tr key={user.user_id}>
                                            <td>{user.first_name}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{new Date(user.birth_date).toLocaleDateString()}</td>
                                            <td>
                                                <button id="edit-button" onClick={() => handleEditUser(user)}>Edit</button>
                                                <button id="delete-button" onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No users found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
        
                    {showNewUserForm && (
                        editingUser ? (
                            <EditUserForm
                                onClose={() => {
                                    setShowNewUserForm(false);
                                    setEditingUser(null);
                                }}
                                onSubmit={handleUpdateUser}
                                initialData={editingUser}
                            />
                        ) : (
                            <AddUserForm
                                onClose={() => setShowNewUserForm(false)}
                                onSubmit={handleSubmitNewUser}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}