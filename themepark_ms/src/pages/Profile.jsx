import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditUserForm from "./Employee/EditUserForm"; // Ensure this path is correct
import "./Profile.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [user, setUser] = useState(null); // State for the logged-in user data
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch logged-in user's profile on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        alert("You must be logged in!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  // Handle submission of updated user data (edit profile)
  const handleEditUser = (updatedUserData) => {
    // Build the payload; ensure it includes user_id from the fetched user data
    const payload = {
      user_id: user.user_id,
      ...updatedUserData,
    };

    const updateUser = async () => {
      try {
        const response = await fetch(`https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/users/${user.user_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update user");

        alert("Profile updated successfully!");
        // Optionally, refetch the user data here; for simplicity, we update state with our payload.
        setUser(payload);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user data:", error);
        alert("Failed to update user.");
      }
    };

    updateUser();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {user ? (
          <>
            <h1>{user.first_name} {user.last_name}</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Birth Date:</strong> {new Date(user.birth_date).toLocaleDateString()}</p>
            
            <button id="edit-profile-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>

            {isEditing && (
              <EditUserForm
                onClose={() => setIsEditing(false)}
                onSubmit={handleEditUser}
                initialData={user}
                editableRole={false} // Pass editableRole={false} to hide role dropdown
              />
            )}
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}
