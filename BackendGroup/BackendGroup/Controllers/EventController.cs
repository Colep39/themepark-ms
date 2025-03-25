using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public EventController(ThemeParkContext context)
        {
            _context = context;
        }

        // GET: api/Event
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            var events = await _context.Events.ToListAsync();
            if (events == null || events.Count == 0)
            {
                return NotFound("No events found.");
            }
            return Ok(events);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        
        [HttpPost]
        public async Task<ActionResult<Event>> PostEvent(Event @event)
        {
            try
            {
                // Generate the next available ID
                var maxId = await _context.Events.MaxAsync(e => (int?)e.event_id) ?? 0;
                @event.event_id = maxId + 1;

                _context.Events.Add(@event);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetEvent),
                    new { id = @event.event_id },
                    @event
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(int id, Event @event)
        {
            if (id != @event.event_id)
            {
                return BadRequest();
            }

            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            
            if (!string.IsNullOrEmpty(@event.event_title))
            {
                existingEvent.event_title = @event.event_title;
            }

            if (!string.IsNullOrEmpty(@event.event_description))
            {
                existingEvent.event_description = @event.event_description;
            }

            if (@event.start_date != default)
            {
                existingEvent.start_date = @event.start_date;
            }

            if (@event.end_date != default)
            {
                existingEvent.end_date = @event.end_date;
            }

            existingEvent.status = @event.status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Events.Any(e => e.event_id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
