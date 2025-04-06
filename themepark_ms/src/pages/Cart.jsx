import { useEffect, useState } from "react";
import './Cart.css'


export default function Cart(){

    const [cartItems, setCartItems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [rides, setRides] = useState([]);
    const [selectedRides, setSelectedRides] = useState([]);

    const taxRate = 0.0625;


    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
            const parsed = JSON.parse(savedCart).map((item) => ({
                ...item,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
            }));
            setCartItems(parsed);
            } catch (e) {
            console.error("Failed to parse cart:", e);
            }
        }
        // Fetch rides data from API
        fetch("/api/rides") // adjust to your actual endpoint
            .then((res) => res.json())
            .then((data) => setRides(data))
            .catch((err) => console.error("Failed to fetch rides:", err));
    }, []);

    const handleRideToggle = (rideName) => {
        setSelectedRides((prevSelected) =>
          prevSelected.includes(rideName)
            ? prevSelected.filter((r) => r !== rideName)
            : [...prevSelected, rideName]
        );
      };
      

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
        }, 0);
    };

    // Optional: Clear the cart
    const handleClearCart = () => {
        localStorage.removeItem("cart");
        setCartItems([]);
    };

    const handleCheckout = () => {
        console.log("User attempts to checkout")
    }

    const calculateSubtotal = () =>
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      
    const calculateTax = () => calculateSubtotal() * taxRate;
      
    const calculateTotalWithTax = () =>
        calculateSubtotal() + calculateTax();

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
                            <strong>Total: ${calculateTotal()}</strong>
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
                                    {/*Display Rides for Customer to Choose*/}
                                    <h3>What Rides Interest You?</h3>
                                    <p>Choose your rides and enjoy the park!</p>
                                    <div className="ride-selection">
                                    {rides.length === 0 ? (
                                        <p>Loading rides...</p>
                                    ) : (
                                        <ul className="ride-list">
                                        {rides.map((ride) => (
                                            <li key={ride.id} className="ride-item">
                                            <label>
                                                <input
                                                type="checkbox"
                                                checked={selectedRides.includes(ride.name)}
                                                onChange={() => handleRideToggle(ride.name)}
                                                />
                                                {ride.name}
                                            </label>
                                            </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>


                                    <h3>Order Summary</h3>
                                    <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                                    <p>Tax (6.25%): ${calculateTax().toFixed(2)}</p>
                                    <p><strong>Total: ${calculateTotalWithTax().toFixed(2)}</strong></p>
                                    <div className="confirmation-buttons">
                                        <button
                                        className="confirm-button"
                                        onClick={() => {
                                            const purchaseInfo = {
                                                cart: cartItems,
                                                rides: selectedRides,
                                              };
                                            
                                            console.log("Purchase confirmed:", purchaseInfo);
                                            alert("Purchase confirmed! 🎉");
                                            // Post to Backend

                                            localStorage.removeItem("cart");
                                            setCartItems([]);
                                            setSelectedRides([]);
                                            setShowConfirmation(false);
                                        }}
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
    )
}