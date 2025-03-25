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
        <Ride name="UmaNator" src="/public/images/ferris-wheel.jpg"/>
        <Ride name="UmaCoaster 3000" src="/public/images//roller-coaster.jpeg"/>
        <Ride name="UmaGeddon" src="/public/images/freefall.webp"/>
        <Ride name="Umapocalypse" src="/public/images/umas-bullet.jpeg"/>
        <Ride name="Uma's Infinite Loop" src="/public/images/umas-infinite-loop.webp"/>
        <Ride name="UmaPhobia" src="/public/images/twirly-thing.jpg"/>
        <Ride name="OctoUma" src="/public/images/kid-ride1.jpg"/>
        <Ride name="Wheel O Uma Jr" src="/public/images/kid-ride2.jpeg"/>
        <Ride name="Heavens Fall" src="/public/images/fall-of-uma.jpg" />
        <Ride name="Umanji" src="/public/images/eye-of-uma.jpg"/>
        <Ride name="BumperUma" src="/public/images/bumper-boats.webp"/>
        <Ride name="UmaLoopa" src="/public/images/coaster-train.jpg"/>
      </div>
    </div>
  )
}