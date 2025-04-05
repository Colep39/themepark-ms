import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Buy-tickets.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ticketOptions = [
  { label: "Season Pass", price: 89 },
  { label: "Adult", price: 12 },
  { label: "Youth", price: 10 },
  { label: "Child", price: 8 },
  { label: "Senior", price: 8 },
  { label: "Student", price: 0 },
];

export default function BuyTickets() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [quantities, setQuantities] = useState(
    ticketOptions.reduce((acc, ticket) => ({ ...acc, [ticket.label]: 0 }), {})
  );

  const handleQuantityChange = (label, value) => {
    setQuantities((prev) => ({ ...prev, [label]: value }));
  };

  const saveCartToLocalStorage = (cartItems) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };
  
  const loadCartFromLocalStorage = () => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  };


  const handleAddToCart = () => {

    if (!selectedDate) {
      alert("Please select a date before adding tickets to cart.");
      return;
    }
    
    const selectedTickets = ticketOptions
      .filter((ticket) => quantities[ticket.label] > 0)
      .map((t) => ({
        type: t.label,                         
        quantity: quantities[t.label],       
        price: t.price,
        date: selectedDate                    
      }));

    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const updatedCart = [...existingCart, ...selectedTickets];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // alert("Tickets added to cart!");
    toast.success("Tickets added to cart!")
    
    console.log(localStorage.getItem("cart"));
    // reset quantities after addding to cart
    setQuantities(ticketOptions.reduce((acc, ticket) => ({ ...acc, [ticket.label]: 0 }), {}));
  };

  // Calculate total price
  const calculateTotal = () => {
    return ticketOptions.reduce((total, ticket) => {
      return total + ticket.price * quantities[ticket.label];
    }, 0);
  };

  return (
    <div className="buy-tickets-page">
      <div className="buy-tickets-container">
        <h2 className="buy-tickets-title">Buy Tickets</h2>
        <DatePicker 
          selected={selectedDate} 
          onChange={(date) => setSelectedDate(date)}
          className="buy-tickets-datePicker" 
          placeholderText="Select a date"
        />
        <div>
          {ticketOptions.map((ticket) => (
            <div key={ticket.label} className="buy-tickets-ticketOption">
              <span>{ticket.label} - ${ticket.price}</span>
              <input
                type="number"
                min="0"
                value={quantities[ticket.label]}
                onChange={(e) => handleQuantityChange(ticket.label, parseInt(e.target.value) || 0)}
                className="buy-tickets-ticketInput"
              />
            </div>
          ))}
        </div>
        
        <div className="buy-tickets-total">
          <span>Total: ${calculateTotal()}</span>
        </div>

        <button onClick={handleAddToCart} className="buy-tickets-button">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
