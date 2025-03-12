import './Visit.css';

export default function Visit(){
    return (
        <>
            <div className="img-container">
                <img src="src/images/main.jpg" alt="Themepark Image" className="visit-img"></img>
                <div className="text-overlay">Book Your Visit</div>
            </div>
            
            <div className="location-info">
                <h1>Location</h1>
                <p>Located in Northern Houston, Texas</p>
                <p>21300 Interstate 45 N, Spring, TX 77373</p>
            </div>
            <div className="visit-info">
                <h1>Hours</h1>
                <div className="hours-container">
                    <div className="hours">Monday</div>
                    <div className="hours">11am - 7pm</div>
                    <div className="hours">Tuesday</div>
                    <div className="hours">11am - 7pm</div>
                    <div className="hours">Wednesday</div>
                    <div className="hours">11am - 7pm</div>
                    <div className="hours">Thursday</div>
                    <div className="hours">11am - 7pm</div>
                    <div className="hours">Friday</div>
                    <div className="hours">12pm - 9pm</div>
                    <div className="hours">Saturday</div>
                    <div className="hours">10am - 8pm</div>
                    <div className="hours">Sunday</div>
                    <div className="hours">10am - 8pm</div>
                </div>
            </div>
            <div className="admission-info">
                <h1>Admission</h1>
                <div id="season-pass-info">
                    <h2>Season Pass Holders</h2>
                    <p>Enjoy discounts on concessions/gifts and unlimited individual visit tickets for the season</p>
                </div>
                <div className="price-container">
                    <div className="price">Adult (18+)</div>
                    <div className="price">$12</div>
                    <div className="price">Youth (11-17)</div>
                    <div className="price">$10</div>
                    <div className="price">Child (10 & younger)</div>
                    <div className="price">$8</div>
                    <div className="price">Senior (65+)</div>
                    <div className="price">$8</div>
                    <div className="price">Fun Friday Pass</div>
                    <div className="price">FREE</div>
                    <div className="price">Student</div>
                    <div className="price">FREE</div>
                </div>
                <div className="btn-container"> <button className="buy-tickets-btn">Buy Tickets</button></div>
            </div>

            <footer>
                <p>University of Houston COSC 3380 Group 14 Themepark Management System</p>
            </footer>
        </>
    )
}