import "./Home.css";
import {useNavigate} from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to UmaZooma Land!</h1>
      </section>

      {/* Explore Attractions */}
      <section className="section">
        <h2>Main Attractions</h2>
        <div className="scroll-container">
          <div className="card">
            <h3>UmaCoaster 3000</h3>
            <img src="src/images/roller-coaster.jpeg"/>
            <p>Experience the thrill of high-speed rides!</p>
          </div>
          <div className="card">
            <h3>Umanji</h3>
            <img src="src/images/eye-of-uma.jpg"/>
            <p>Dive into the ultimate water experience!</p>
          </div>
          <div className="card">
            <h3>Umapocalypse</h3>
            <img src="src/images/umas-bullet.jpeg"/>
            <p>Step into a world of magic and wonder!</p>
          </div>
        </div>
        <button onClick={() => navigate('/rides')}className="button">Explore Rides!</button>
      </section>

      {/* Explore Shops */}
      <section className="section">
        <h2>Shops & Dining</h2>
        <div className="scroll-container">
          <div className="card">
            <h3>Candy Kingdom</h3>
            <img src="src/images/kid-ride2.jpeg"/>
            <p>Sweet treats for all ages!</p>
          </div>
          <div className="card">
            <h3>Adventure Gear</h3>
            <img src="src/images/kid-ride2.jpeg"/>
            <p>Get your favorite UmaZooma merch!</p>
          </div>
          <div className="card">
            <h3>Gourmet Bites</h3>
            <img src="src/images/kid-ride2.jpeg"/>
            <p>Delicious food from around the world!</p>
          </div>
        </div>
        <button onClick={() => navigate('/shops')}className="button">Explore Shops!</button>
      </section>

      {/* Location & Hours */}
      <section className="location-section">
        <h2>Location & Park Info</h2>
        <p>21300 Interstate 45 N, Spring, TX 77373</p>
        <button onClick={() => navigate('/visit')}className="button">More Information</button>
      </section>
    </div>
  );
};
