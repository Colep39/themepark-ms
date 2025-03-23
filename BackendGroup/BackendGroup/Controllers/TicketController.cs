using BackendGroup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public TicketController(ThemeParkContext context)
        {
            _context = context;
        }

        // GET: api/ticket
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
        {
            // Include related entities
            var tickets = await _context.Tickets
                .Include(t => t.Visitor)
                .Include(t => t.Ride)
                .ToListAsync();

            return Ok(tickets);
        }

        // GET: api/ticket/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Visitor)
                .Include(t => t.Ride)
                .FirstOrDefaultAsync(t => t.ticket_id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        // POST: api/ticket
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket([FromBody] Ticket ticket)
        {
            if (ticket == null)
            {
                return BadRequest("Invalid ticket data.");
            }

            // Check if Visitor and Ride exist before associating them
            if (ticket.visitor_id.HasValue && !_context.Visitors.Any(v => v.customer_id == ticket.visitor_id))
            {
                return BadRequest($"Visitor with ID {ticket.visitor_id} does not exist.");
            }

            if (!_context.Rides.Any(r => r.ride_id == ticket.ride_id))
            {
                return BadRequest($"Ride with ID {ticket.ride_id} does not exist.");
            }

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.ticket_id }, ticket);
        }

        // PUT: api/ticket/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(int id, [FromBody] Ticket updatedTicket)
        {
            if (id != updatedTicket.ticket_id)
            {
                return BadRequest("ID mismatch.");
            }

            var existingTicket = await _context.Tickets.FindAsync(id);
            if (existingTicket == null)
            {
                return NotFound();
            }

            // Update only provided fields
            existingTicket.visitor_id = updatedTicket.visitor_id ?? existingTicket.visitor_id;
            existingTicket.ride_id = updatedTicket.ride_id;
            existingTicket.Purchase_date = updatedTicket.Purchase_date ?? existingTicket.Purchase_date;
            existingTicket.ticket_type = updatedTicket.ticket_type ?? existingTicket.ticket_type;
            existingTicket.Price = updatedTicket.Price ?? existingTicket.Price;

            // Ensure foreign keys exist
            if (updatedTicket.visitor_id.HasValue && !_context.Visitors.Any(v => v.customer_id == updatedTicket.visitor_id))
            {
                return BadRequest($"Visitor with ID {updatedTicket.visitor_id} does not exist.");
            }

            if (!_context.Rides.Any(r => r.ride_id == updatedTicket.ride_id))
            {
                return BadRequest($"Ride with ID {updatedTicket.ride_id} does not exist.");
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ticket/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
