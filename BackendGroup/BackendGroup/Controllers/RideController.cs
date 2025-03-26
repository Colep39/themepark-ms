using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;


namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RideController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public RideController(ThemeParkContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ride>>> GetRides()
        {
            var rides = await _context.Rides.ToListAsync();
            if (rides == null || rides.Count == 0)
            {
                return NotFound("No rides found.");
            }
            return Ok(rides);
        }

        //GET id
        [HttpGet("{id}")]
        public async Task<ActionResult<Ride>> GetRide(int id)
        {
            var ride = await _context.Rides.FindAsync(id);

            if (ride == null)
            {
                return NotFound();
            }

            return ride;
        }

        //POST - essentially create
        [HttpPost]
        public async Task<ActionResult<Ride>> PostRide(Ride ride)
        {
            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRide), new { id = ride.ride_id }, ride);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRide(int id, Ride ride)
        {
            if (id != ride.ride_id)
            {
                return BadRequest();
            }

            var existingRide = await _context.Rides.FindAsync(id);
            if (existingRide == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(ride.ride_name))
            {
                existingRide.ride_name = ride.ride_name;
            }

            if (ride.capacity > 0)
            {
                existingRide.capacity = ride.capacity;
            }

            if (ride.status >= 0)
            {
                existingRide.status = ride.status;
            }

            if (ride.last_maintenance_date.HasValue)
            {
                existingRide.last_maintenance_date = ride.last_maintenance_date;
            }

            if (ride.maintenance_count >= 0)
            {
                existingRide.maintenance_count = ride.maintenance_count;
            }

            if (ride.type >= 0)
            {
                existingRide.type = ride.type;
            }

            if (ride.ride_img != null)
            {
                existingRide.ride_img = ride.ride_img;
            }

            if (ride.thrill_level > 0)
            {
                existingRide.thrill_level = ride.thrill_level;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }



        //DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRide(int id)
        {
            var ride = await _context.Rides.FindAsync(id);

            if (ride == null)
            {
                return NotFound();
            }

            _context.Rides.Remove(ride);
            await _context.SaveChangesAsync();

            return NoContent();

        }
    }
}
