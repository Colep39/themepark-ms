using BackendGroup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MySql.Data.MySqlClient;
using System.Text.Json;

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
            var tickets = await _context.Tickets
                .Include(t => t.User)  // Fixed casing
                .Include(t => t.Ride)
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetMyTickets()
        {
            var userIdClaim = User.FindFirst("UserID")?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID format.");
            }

            var tickets = await _context.Tickets
                .Where(t => t.user_id == userId)
                .ToListAsync();

            return tickets;
        }


        // GET: api/ticket/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)  // Fixed casing
                .Include(t => t.Ride)
                .FirstOrDefaultAsync(t => t.ticket_id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        // Get ticket report by date range
        [HttpGet("report")]
        public async Task<ActionResult<IEnumerable<TicketReport>>> GetTicketReport(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
            {
                return BadRequest("Start date must be before end date.");
            }

            var report = await _context.Set<TicketReport>()
                .FromSqlRaw("CALL GetTicketReport({0}, {1})", startDate, endDate)
                .ToListAsync();

            return Ok(report);
        }

        // Get ticket statistics by date range
        [HttpGet("statistics")]
        public async Task<ActionResult<TicketStatistics>> GetTicketStatistics(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest("Start date must be before end date.");
                }

                var statistics = await _context.Set<TicketStatistics>()
                    .FromSqlRaw(@"
                        SELECT 
                            COUNT(*) as TotalTickets,
                            COALESCE(SUM(Price), 0) as TotalRevenue,
                            JSON_OBJECT(
                                'Adult', SUM(CASE WHEN ticket_type = 'adult' THEN 1 ELSE 0 END),
                                'Season', SUM(CASE WHEN ticket_type = 'season' THEN 1 ELSE 0 END),
                                'Youth', SUM(CASE WHEN ticket_type = 'youth' THEN 1 ELSE 0 END),
                                'Child', SUM(CASE WHEN ticket_type = 'child' THEN 1 ELSE 0 END),
                                'Senior', SUM(CASE WHEN ticket_type = 'senior' THEN 1 ELSE 0 END),
                                'Student', SUM(CASE WHEN ticket_type = 'student' THEN 1 ELSE 0 END)
                            ) as TicketsByType
                        FROM ticket
                        WHERE DATE(Purchase_date) BETWEEN DATE({0}) AND DATE({1})", 
                        startDate, endDate)
                    .FirstOrDefaultAsync();

                if (statistics == null)
                {
                    return Ok(new TicketStatistics
                    {
                        TotalTickets = 0,
                        TotalRevenue = 0,
                        TicketsByType = new Dictionary<string, int>()
                    });
                }

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTicketStatistics: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "An error occurred while retrieving ticket statistics.", error = ex.Message });
            }
        }

        // POST: api/ticket
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket([FromBody] Ticket ticket)
        {
            if (ticket == null)
            {
                return BadRequest("Invalid ticket data.");
            }

            if (ticket.user_id.HasValue && !_context.Users.Any(u => u.user_id == ticket.user_id))
            {
                return BadRequest($"User with ID {ticket.user_id} does not exist.");
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

            existingTicket.user_id = updatedTicket.user_id ?? existingTicket.user_id;
            existingTicket.ride_id = updatedTicket.ride_id;
            existingTicket.Purchase_date = updatedTicket.Purchase_date ?? existingTicket.Purchase_date;
            existingTicket.ticket_type = updatedTicket.ticket_type ?? existingTicket.ticket_type;
            existingTicket.Price = updatedTicket.Price ?? existingTicket.Price;

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

            return NoContent(); // Status 204 to indicate the resource was successfully deleted
        }

    }
}

