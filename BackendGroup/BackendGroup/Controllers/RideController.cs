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

        //GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ride>>> GetRides()
        {
            return await _context.Rides.ToListAsync();
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

        //PUT -- essentially update
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRide(int id, Ride ride)
        {
            if (id != ride.ride_id)
            {
                return BadRequest();
            }

            _context.Entry(ride).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Rides.Any(r => r.ride_id == id))
                {
                    return NotFound();
                }
                throw;
            }
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
