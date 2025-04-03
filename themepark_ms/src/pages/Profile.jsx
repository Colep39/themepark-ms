import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        alert("You must be logged in!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          alert("Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile Page</h2>
      <div className="profile-info">
        <p><strong>First Name:</strong> {userData.first_name}</p>
        <p><strong>Last Name:</strong> {userData.last_name}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Date of Birth:</strong> {userData.birth_date ? userData.birth_date.split("T")[0] : "N/A"}</p>
      </div>
    </div>
  );
}