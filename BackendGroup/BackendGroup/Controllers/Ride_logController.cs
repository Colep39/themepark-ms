using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;


namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Ride_logController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public Ride_logController(ThemeParkContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ride_log>>> GetRide_logs()
        {
            var ride_logs = await _context.Ride_logs.ToListAsync();
            if (ride_logs == null || ride_logs.Count == 0)
            {
                return NotFound("No ride_logs found.");
            }
            return Ok(ride_logs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ride_log>> GetRide_log(int id)
        {
            var ride_log = await _context.Ride_logs
                .Include(r => r.Ride)  // Include the related 'Ride' entity
                .FirstOrDefaultAsync(r => r.log_id == id);

            if (ride_log == null)
            {
                return NotFound();
            }

            return Ok(ride_log);
        }


        //POST - essentially create
        [HttpPost]
        public async Task<ActionResult<Ride_log>> PostRide_log(Ride_log ride_log)
        {
            _context.Ride_logs.Add(ride_log);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRide_log), new { id = ride_log.log_id }, ride_log);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRideLog(int id, Ride_log rideLog)
        {
            if (id != rideLog.log_id)
            {
                return BadRequest();
            }

            var existingRideLog = await _context.Ride_logs.FindAsync(id);
            if (existingRideLog == null)
            {
                return NotFound();
            }

            // Only update fields if they are provided (non-null)
            if (rideLog.ride_date != default)
            {
                existingRideLog.ride_date = rideLog.ride_date;
            }

            if (rideLog.ride_time != default)
            {
                existingRideLog.ride_time = rideLog.ride_time;
            }

            if (rideLog.ride_duration > 0)
            {
                existingRideLog.ride_duration = rideLog.ride_duration;
            }

            if (rideLog.ride_id > 0)
            {
                existingRideLog.ride_id = rideLog.ride_id;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Ride_logs.Any(r => r.log_id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }


        //DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRide_log(int id)
        {
            var ride_log = await _context.Ride_logs.FindAsync(id);

            if (ride_log == null)
            {
                return NotFound();
            }

            _context.Ride_logs.Remove(ride_log);
            await _context.SaveChangesAsync();

            return NoContent();

        }
    }
}
