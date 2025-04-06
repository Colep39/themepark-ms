import { useState } from "react";
import "./My-Tickets.css";

export default function MyTickets() {
  // Sample ticket data (replace with real data from API or backend later)
  const [tickets, setTickets] = useState([
    { type: "Adult (18+)", date: "2025-04-12", quantity: 2 },
    { type: "Youth (11-17)", date: "2025-05-01", quantity: 1 },
    { type: "Senior (65+)", date: "2025-06-15", quantity: 3 },
  ]);

  return (
    <div className="my-tickets-page">
      <div className="tickets-container">
        <h2 className="tickets-title">My Tickets</h2>
        {tickets.length > 0 ? (
          <div className="tickets-list">
            {tickets.map((ticket, index) => (
              <div key={index} className="ticket-item">
                <p><strong>Type:</strong> {ticket.type}</p>
                <p><strong>Date:</strong> {ticket.date}</p>
                <p><strong>Quantity:</strong> {ticket.quantity}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tickets">You have no tickets yet.</p>
        )}
      </div>
    </div>
  );
}
