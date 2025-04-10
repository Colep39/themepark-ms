using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public MaintenanceController(ThemeParkContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Maintenance>>> GetMaintenances()
        {
            var maintenances = await _context.Maintenances
                .Include(m => m.Ride)
                .ToListAsync();

            if (maintenances == null || maintenances.Count == 0)
            {
                return NotFound("No Maintenances found.");
            }

            return Ok(maintenances);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Maintenance>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances
                .Include(r => r.Ride)
                .FirstOrDefaultAsync(r => r.maintenance_id == id);

            if (maintenance == null)
            {
                return NotFound();
            }

            return Ok(maintenance);
        }

        [HttpGet("MaintenanceByRange")]
        public async Task<List<Maintenance>> GetMaintenanceByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var maintenanceData = await _context.Maintenances
                .FromSqlRaw("CALL GetMaintenanceByRange({0}, {1})", startDate, endDate)
                .ToListAsync();

            return maintenanceData;
        }

        [HttpGet("MaintenanceByCost")]
        public async Task<List<Maintenance>> GetMaintenanceByMinCostAsync(int MaintenanceCost)
        {
            var maintenanceData = await _context.Maintenances
                .FromSqlRaw("CALL GetMaintenanceByCost({0})", MaintenanceCost)
                .ToListAsync();

            return maintenanceData;
        }

        [HttpPost]
        public async Task<ActionResult<Maintenance>> PostMaintenance(Maintenance maintenance)
        {
            if (maintenance.ride_id == 0)
            {
                return BadRequest("Ride ID is required.");
            }

            var ride = await _context.Rides.FindAsync(maintenance.ride_id);
            if (ride == null)
            {
                return BadRequest("Invalid Ride ID.");
            }

            _context.Maintenances.Add(maintenance);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Trigger will throw SQL exception if there's already a pending maintenance
                return BadRequest("This ride already has a pending maintenance.");
            }

            return CreatedAtAction(nameof(GetMaintenance), new { id = maintenance.maintenance_id }, maintenance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaintenance(int id, Maintenance maintenance)
        {
            if (id != maintenance.maintenance_id)
            {
                return BadRequest();
            }

            var existingMaintenance = await _context.Maintenances.FindAsync(id);
            if (existingMaintenance == null)
            {
                return NotFound();
            }

            // Update only fields that are allowed to change
            if (maintenance.startDate != default)
                existingMaintenance.startDate = maintenance.startDate;

            if (maintenance.endDate != default)
                existingMaintenance.endDate = maintenance.endDate;

            if (!string.IsNullOrEmpty(maintenance.description))
                existingMaintenance.description = maintenance.description;

            if (maintenance.status >= 0)
                existingMaintenance.status = maintenance.status;

            if (maintenance.maintenanceCost > 0)
                existingMaintenance.maintenanceCost = maintenance.maintenanceCost;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Database update failed.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null)
            {
                return NotFound();
            }

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
