import './Rides.css';
import Ride from './Ride.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Rides() {

  // Fetching rides from backend to store and display
  const [rides, setRides] = useState([]);

  const API_BASE_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ride'; 

    useEffect(() => {
      fetchRides();
  }, []);

  const fetchRides = async () => {
      try {
          const response = await axios.get(API_BASE_URL);
          console.log("Fetched ride data:", response.data); 
          setRides(response.data);
      } catch (error) {
          console.error("Error fetching rides:", error);
      }
  };

  return (
    <div className="ride-component-container">
      <div className="img-container">
        <img src="/images/rides-background.jpg" alt="Themepark Image" className="main-ride-img"></img>
        <div className="text-overlay">Rides</div>
      </div>

      <div className="rides-container">
        {/*
        <Ride name="UmaNator" src="/images/ferris-wheel.jpg"/>
        <Ride name="UmaCoaster 3000" src="/images/roller-coaster.jpeg"/>
        <Ride name="UmaGeddon" src="/images/freefall.webp"/>
        <Ride name="Umapocalypse" src="/images/umas-bullet.jpeg"/>
        <Ride name="Uma's Infinite Loop" src="/images/umas-infinite-loop.webp"/>
        <Ride name="UmaPhobia" src="/images/twirly-thing.jpg"/>
        <Ride name="OctoUma" src="/images/kid-ride1.jpg"/>
        <Ride name="Wheel O Uma Jr" src="/images/kid-ride2.jpeg"/>
        <Ride name="Heavens Fall" src="/images/fall-of-uma.jpg" />
        <Ride name="Umanji" src="/images/eye-of-uma.jpg"/>
        <Ride name="BumperUma" src="/images/bumper-boats.webp"/>
        <Ride name="UmaLoopa" src="/images/coaster-train.jpg"/>
        */}

        {rides.map((ride, index) => (
          <div className="ride-card" key={index}>
            <h3 className="ride-name">{ride.ride_name}</h3>
            <img
              src={ride.ride_img}
              alt={ride.ride_name}
              className="ride-image"
            />
          </div>
        ))}

      </div>
    </div>
  )
}