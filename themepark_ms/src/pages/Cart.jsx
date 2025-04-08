import { useEffect, useState } from "react";
import './Cart.css';

// Helper function to decode JWT token and parse its payload.
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch(e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rides, setRides] = useState([]);
  const [selectedRides, setSelectedRides] = useState([]);

  const taxRate = 0.0625;

  // Load cart and rides on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart).map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        }));
        setCartItems(parsed);
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
    // Ensure you match the case used in your RideController route
    fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/Ride")
      .then(res => res.json())
      .then(data => setRides(data))
      .catch(err => console.error("Failed to fetch rides:", err));
  }, []);

  const handleRideToggle = (rideName) => {
    setSelectedRides(prevSelected =>
      prevSelected.includes(rideName)
        ? prevSelected.filter(r => r !== rideName)
        : [...prevSelected, rideName]
    );
  };

  // Calculate totals for display
  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const calculateTax = () => calculateSubtotal() * taxRate;
  const calculateTotalWithTax = () =>
    calculateSubtotal() + calculateTax();

  // Optional: Clear the cart
  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  // Async function to handle checkout POST calls
  const handleConfirmPurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to complete your purchase.");
      return;
    }

    // Decode token to get the user ID from its payload.
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.UserID) {
      alert("Invalid token. Please log in again.");
      return;
    }
    const userId = parseInt(decodedToken.UserID);

    // Calculate total number of tickets purchased
    const totalTickets = cartItems.reduce((sum, item) => sum + parseInt(item.quantity), 0);

    // Check that at least one ride is selected.
    if (selectedRides.length === 0) {
      alert("Please select at least one ride before confirming your purchase.");
      return;
    }

    // Determine a primary ride for the ticket table (using the first selected ride)
    let primaryRideId = null;
    const primaryRide = rides.find(r => r.ride_name === selectedRides[0]);
    if (primaryRide) {
      primaryRideId = primaryRide.ride_id;
    } else {
      alert("Selected primary ride not found.");
      return;
    }

    try {
      // POST tickets - one entry per ticket purchased.
      // If, for example, the cart contains two types (youth and adult) with quantity 1 each,
      // this will create two separate entries.
      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          const ticketPayload = {
            user_id: userId,               
            ride_id: primaryRideId,        
            Purchase_date: item.date,      
            ticket_type: item.type,        
            Price: item.price
          };

          await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/Ticket", {  // Note capital "T" to match route.
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ticketPayload)
          });
        }
      }

      // POST ride logs - for each selected ride, create an entry per ticket purchased.
      for (const rideName of selectedRides) {
        const rideObj = rides.find(r => r.ride_name === rideName);
        if (rideObj) {
          for (let i = 0; i < totalTickets; i++) {
            const rideLogPayload = {
              date: new Date().toISOString(), // current date/time in ISO format
              ride_count: 1,                  // one log entry per ticket
              ride_id: rideObj.ride_id
            };

            await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/Ride_log", {  
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(rideLogPayload)
            });
          }
        }
      }

      alert("Purchase confirmed! 🎉");
      // Clear cart after successful purchase
      localStorage.removeItem("cart");
      setCartItems([]);
      setSelectedRides([]);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("There was an error processing your purchase. Please try again.");
    }
  };

  return (
    <>
      <div className="cart-page">
        <div className="CartContainer">
          <h2>Your Cart</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="cart-items-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <div>
                      <strong>Ticket: {item.type}</strong>
                      <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price per Ticket: ${item.price}</p>
                      <p>Subtotal: ${parseFloat(item.price) * parseInt(item.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-total">
                <strong>Total: ${calculateSubtotal()}</strong>
              </div>

              <div className="cart-actions">
                {!showConfirmation ? (
                  <div>
                    <button
                      className="checkout-button"
                      onClick={() => setShowConfirmation(true)}
                    >
                      Checkout
                    </button>
                    <button
                      className="clear-cart-button"
                      onClick={() => {
                        localStorage.removeItem("cart");
                        setCartItems([]);
                        setShowConfirmation(false);
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                ) : (
                  <div className="checkout-summary">
                    {/* Display Rides for Customer to Choose */}
                    <h3>What Rides Interest You?</h3>
                    <p>Choose your rides and enjoy the park!</p>
                    <div className="ride-selection">
                      {rides.length === 0 ? (
                        <p>Loading rides...</p>
                      ) : (
                        <ul className="ride-list">
                          {rides.map((ride) => (
                            <li key={ride.ride_id} className="ride-item">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selectedRides.includes(ride.ride_name)}
                                  onChange={() => handleRideToggle(ride.ride_name)}
                                />
                                {ride.ride_name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <h3>Order Summary</h3>
                    <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                    <p>Tax (6.25%): ${calculateTax().toFixed(2)}</p>
                    <p>
                      <strong>Total: ${calculateTotalWithTax().toFixed(2)}</strong>
                    </p>
                    <div className="confirmation-buttons">
                      <button
                        className="confirm-button"
                        onClick={handleConfirmPurchase}
                      >
                        Confirm Purchase
                      </button>
                      <button
                        className="clear-cart-button"
                        onClick={() => {
                          localStorage.removeItem("cart");
                          setCartItems([]);
                          setSelectedRides([]);
                          setShowConfirmation(false);
                        }}
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
