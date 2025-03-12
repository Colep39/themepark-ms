import './Rides.css';
import Ride from './Ride.jsx';

export default function Rides() {
  return (
    <div className="ride-component-container">
      <div className="img-container">
        <img src="src/images/main-rides-img.jpeg" alt="Themepark Image" className="main-ride-img"></img>
        <div className="text-overlay">Rides</div>
      </div>

      <div className="rides-container">
        <Ride name="UmaNator" src="src/images/ferris-wheel.jpg"/>
        <Ride name="UmaCoaster 3000" src="src/images/roller-coaster.jpeg"/>
        <Ride name="UmaGeddon" src="src/images/freefall.webp"/>
        <Ride name="Umapocalypse" src="src/images/umas-bullet.jpeg"/>
        <Ride name="Uma's Infinite Loop" src="src/images/umas-infinite-loop.webp"/>
        <Ride name="UmaPhobia" src="src/images/twirly-thing.jpg"/>
        <Ride name="OctoUma" src="src/images/kid-ride1.jpg"/>
        <Ride name="Wheel O Uma Jr" src="src/images/kid-ride2.jpeg"/>
        <Ride name="Heavens Fall" src="src/images/fall-of-uma.jpg" />
        <Ride name="Umanji" src="src/images/eye-of-uma.jpg"/>
        <Ride name="BumperUma" src="src/images/bumper-boats.webp"/>
        <Ride name="UmaLoopa" src="src/images/coaster-train.jpg"/>
      </div>
    </div>
  )
}