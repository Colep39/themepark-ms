import { useState, useEffect } from "react"; 
import "./My-Tickets.css";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/ticket/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API tickets data:", data);

        // Group tickets by type and date
        const grouped = {};
        data.forEach(ticket => {
          // Use the camelCase property from JSON
          const rawDate = ticket.purchase_date || ticket.Purchase_date; // try both
          console.log("Raw date from API:", rawDate);

          // Truncate date string to only YYYY-MM-DD
          let dateOnly = "Unknown";
          if (rawDate) {
            const parsed = new Date(rawDate);
            if (!isNaN(parsed)) {
              dateOnly = parsed.toISOString().split("T")[0]; // format: yyyy-mm-dd
            } else {
              console.log("Invalid date parsing:", rawDate);
            }
          }
          const key = `${ticket.ticket_type}-${dateOnly}`;

          if (grouped[key]) {
            grouped[key].count += 1;
          } else {
            grouped[key] = {
              ticket_type: ticket.ticket_type,
              Purchase_date: dateOnly,
              count: 1,
            };
          }
        });

        setTickets(Object.values(grouped));
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="my-tickets-page">
      <div className="tickets-container">
        <h2 className="tickets-title">My Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length > 0 ? (
          <div className="tickets-list">
            {tickets.map((ticket, index) => (
              <div key={index} className="ticket-item">
                <p><strong>Type:</strong> {ticket.ticket_type}</p>
                <p><strong>Date:</strong> {ticket.Purchase_date}</p>
                <p><strong>Quantity:</strong> {ticket.count}</p>
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
