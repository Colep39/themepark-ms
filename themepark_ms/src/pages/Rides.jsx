import './Rides.css';
import Ride from './Ride.jsx';

export default function Rides() {
  return (
    <div className="ride-component-container">
      <div className="img-container">
        <img src="/images/main-rides-img.jpeg" alt="Themepark Image" className="main-ride-img"></img>
        <div className="text-overlay">Rides</div>
      </div>

      <div className="rides-container">
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
      </div>
    </div>
  )
}