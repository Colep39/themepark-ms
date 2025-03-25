import { useEffect, useState } from "react";
import './Cart.css'


export default function Cart(){

    const [cartItems, setCartItems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
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
    }, []);

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
                        <button
                            className="checkout-button"
                            onClick={() => setShowConfirmation(true)}
                        >
                        
                            Checkout
                        </button>
                        
                        ) : (
                        <div className="checkout-summary">
                            <h3>Order Summary</h3>
                            <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                            <p>Tax (6.25%): ${calculateTax().toFixed(2)}</p>
                            <p><strong>Total: ${calculateTotalWithTax().toFixed(2)}</strong></p>
                            <button
                            className="confirm-button"
                            onClick={() => {
                                alert("Purchase confirmed! 🎉");
                                localStorage.removeItem("cart");
                                setCartItems([]);
                                setShowConfirmation(false);
                            }}
                            >
                            Confirm Purchase
                            </button>
                        </div>
                    )}
                   
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
                    </>
                )}
            </div>
        </>
    )
}