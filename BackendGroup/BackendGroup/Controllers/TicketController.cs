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
            [FromQuery] string startDate,
            [FromQuery] string endDate)
        {
            try
            {
                if (!DateTime.TryParse(startDate, out DateTime parsedStartDate) ||
                    !DateTime.TryParse(endDate, out DateTime parsedEndDate))
                {
                    return BadRequest("Invalid date format. Use YYYY-MM-DD format.");
                }

                if (parsedStartDate > parsedEndDate)
                {
                    return BadRequest("Start date must be before end date.");
                }

                var report = await _context.Set<TicketReport>()
                    .FromSqlRaw("CALL GetTicketReport({0}, {1})", parsedStartDate, parsedEndDate)
                    .ToListAsync();

                return Ok(report);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTicketReport: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving ticket report.", error = ex.Message });
            }
        }

        // Get ticket statistics by date range
        [HttpGet("statistics")]
        public async Task<ActionResult<TicketStatistics>> GetTicketStatistics(
            [FromQuery] string startDate,
            [FromQuery] string endDate)
        {
            try
            {
                if (!DateTime.TryParse(startDate, out DateTime parsedStartDate) ||
                    !DateTime.TryParse(endDate, out DateTime parsedEndDate))
                {
                    return BadRequest("Invalid date format. Use YYYY-MM-DD format.");
                }

                if (parsedStartDate > parsedEndDate)
                {
                    return BadRequest("Start date must be before end date.");
                }

                var statistics = await _context.Set<TicketStatistics>()
                    .FromSqlRaw(@"
                        SELECT 
                            COUNT(*) as TotalTickets,
                            COALESCE(SUM(Price), 0) as TotalRevenue,
                            JSON_OBJECT(
                                'Adult', COALESCE(SUM(CASE WHEN ticket_type = 'adult' THEN 1 ELSE 0 END), 0),
                                'Season', COALESCE(SUM(CASE WHEN ticket_type = 'season' THEN 1 ELSE 0 END), 0),
                                'Youth', COALESCE(SUM(CASE WHEN ticket_type = 'youth' THEN 1 ELSE 0 END), 0),
                                'Child', COALESCE(SUM(CASE WHEN ticket_type = 'child' THEN 1 ELSE 0 END), 0),
                                'Senior', COALESCE(SUM(CASE WHEN ticket_type = 'senior' THEN 1 ELSE 0 END), 0),
                                'Student', COALESCE(SUM(CASE WHEN ticket_type = 'student' THEN 1 ELSE 0 END), 0)
                            ) as TicketsByType
                        FROM ticket
                        WHERE DATE(Purchase_date) BETWEEN DATE({0}) AND DATE({1})", 
                        parsedStartDate, parsedEndDate)
                    .FirstOrDefaultAsync();

                if (statistics == null)
                {
                    statistics = new TicketStatistics
                    {
                        TotalTickets = 0,
                        TotalRevenue = 0,
                        TicketsByType = new Dictionary<string, int>
                        {
                            { "Adult", 0 },
                            { "Season", 0 },
                            { "Youth", 0 },
                            { "Child", 0 },
                            { "Senior", 0 },
                            { "Student", 0 }
                        }
                    };
                }

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTicketStatistics: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving ticket statistics.", error = ex.Message });
            }
        }

        // GET: api/ticket/toprides
        [HttpGet("toprides")]
        public async Task<ActionResult<IEnumerable<TopRideStatistics>>> GetTopRides(
            [FromQuery] string startDate,
            [FromQuery] string endDate)
        {
            try
            {
                if (!DateTime.TryParse(startDate, out DateTime parsedStartDate) ||
                    !DateTime.TryParse(endDate, out DateTime parsedEndDate))
                {
                    return BadRequest("Invalid date format. Use YYYY-MM-DD format.");
                }

                if (parsedStartDate > parsedEndDate)
                {
                    return BadRequest("Start date must be before end date.");
                }

                var sql = @"
                    SELECT 
                        r.ride_name AS RideName,
                        COALESCE(SUM(rl.ride_count), 0) AS RideCount
                    FROM ride r
                    LEFT JOIN ride_logs rl ON r.ride_id = rl.ride_id
                        AND DATE(rl.date) BETWEEN {0} AND {1}
                    GROUP BY r.ride_id, r.ride_name
                    ORDER BY RideCount DESC
                    LIMIT 3";

                var topRides = await _context.Set<TopRideStatistics>()
                    .FromSqlRaw(sql, parsedStartDate, parsedEndDate)
                    .ToListAsync();

                return Ok(topRides);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTopRides: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while retrieving top rides.", error = ex.Message });
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

