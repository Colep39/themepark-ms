import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Buy-tickets.css";

const ticketOptions = [
  { label: "Season Pass", price: 89 },
  { label: "Adult (18+)", price: 12 },
  { label: "Youth (11-17)", price: 10 },
  { label: "Child (10 & younger)", price: 8 },
  { label: "Senior (65+)", price: 8 },
  { label: "Uma Student", price: 0 },
];

export default function BuyTickets() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [quantities, setQuantities] = useState(
    ticketOptions.reduce((acc, ticket) => ({ ...acc, [ticket.label]: 0 }), {})
  );

  const handleQuantityChange = (label, value) => {
    setQuantities((prev) => ({ ...prev, [label]: value }));
  };

  const handleAddToCart = () => {
    const selectedTickets = ticketOptions.filter(
      (ticket) => quantities[ticket.label] > 0
    );
    console.log("Added to cart:", selectedTickets.map(t => ({
      type: t.label,
      quantity: quantities[t.label],
      price: t.price,
    })));
  };

  // Calculate total price
  const calculateTotal = () => {
    return ticketOptions.reduce((total, ticket) => {
      return total + ticket.price * quantities[ticket.label];
    }, 0);
  };

  return (
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
  );
}
