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
            var Maintenances = await _context.Maintenances.ToListAsync();
            if (Maintenances == null || Maintenances.Count == 0)
            {
                return NotFound("No Maintenances found.");
            }
            return Ok(Maintenances);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Maintenance>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances
                .Include(r => r.Ride)  // Include the related 'Ride' entity
                .FirstOrDefaultAsync(r => r.maintenance_id == id);

            if (maintenance == null)
            {
                return NotFound();
            }

            return Ok(maintenance);
        }

         // Method to call the GetMaintenanceByRange stored procedure
         [HttpGet("MaintenanceByRange")]
        public async Task<List<Maintenance>> GetMaintenanceByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            // Execute the stored procedure and map the result to a list of Maintenance
            var maintenanceData = await _context.Maintenances
                .FromSqlRaw("CALL GetMaintenanceByRange({0}, {1})", startDate, endDate)
                .ToListAsync();

            return maintenanceData;
        }

        // Method to call the GetMaintenanceByCost stored procedure
        [HttpGet("MaintenanceByCost")]
        public async Task<List<Maintenance>> GetMaintenanceByMinCostAsync(int MaintenanceCost)
        {
            // Execute the stored procedure and map the result to a list of Maintenance
            var maintenanceData = await _context.Maintenances
                .FromSqlRaw("CALL GetMaintenanceByCost({0})", MaintenanceCost)  // Pass only minCost as int
                .ToListAsync();

            return maintenanceData;
        }

        
        //POST - essentially create
        [HttpPost]
        public async Task<ActionResult<Maintenance>> PostMaintenance(Maintenance maintenance)
        {
            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenance), new { id = maintenance.maintenance_id}, maintenance);
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

            // Only update fields if they are provided (non-null)
            if (maintenance.startDate != default)
            {
                existingMaintenance.startDate = maintenance.startDate;
            }

            if (maintenance.endDate != default)
            {
                existingMaintenance.endDate = maintenance.endDate;
            }

            if (!string.IsNullOrEmpty(maintenance.description))
            {
                existingMaintenance.description = maintenance.description;
            }

            if (maintenance.status >= 0)
            {
                existingMaintenance.status = maintenance.status;
            }

            if (maintenance.maintenanceCost > 0)
            {
                existingMaintenance.maintenanceCost = maintenance.maintenanceCost;
            }

            if (maintenance.ride_id > 0)
            {
                existingMaintenance.ride_id = maintenance.ride_id;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Maintenances.Any(r => r.maintenance_id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }


        //DELETE
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
