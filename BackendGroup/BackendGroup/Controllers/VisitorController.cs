using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitorController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public VisitorController(ThemeParkContext context)
        {
            _context = context;
        }

        // GET: api/visitor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visitor>>> GetVisitors()
        {
            return await _context.Visitors.ToListAsync();
        }

        // GET api/visitor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Visitor>> GetVisitor(int id)
        {
            var visitor = await _context.Visitors.FindAsync(id);
            if (visitor == null)
            {
                return NotFound();
            }
            return visitor;
        }

        // POST api/visitor
        [HttpPost]
        public async Task<ActionResult<Visitor>> PostVisitor([FromBody] Visitor visitor)
        {
            if (visitor == null)
            {
                return BadRequest("Invalid visitor data.");
            }

            _context.Visitors.Add(visitor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVisitor), new { id = visitor.customer_id }, visitor);
        }

        // PUT: api/visitor/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisitor(int id, [FromBody] Visitor updatedVisitor)
        {
            if (id != updatedVisitor.customer_id)
            {
                return BadRequest("ID mismatch.");
            }

            var existingVisitor = await _context.Visitors.FindAsync(id);
            if (existingVisitor == null)
            {
                return NotFound();
            }

            // Only update fields that are provided
            existingVisitor.first_name = !string.IsNullOrEmpty(updatedVisitor.first_name)
                ? updatedVisitor.first_name
                : existingVisitor.first_name;

            existingVisitor.last_name = !string.IsNullOrEmpty(updatedVisitor.last_name)
                ? updatedVisitor.last_name
                : existingVisitor.last_name;

            existingVisitor.email = !string.IsNullOrEmpty(updatedVisitor.email)
                ? updatedVisitor.email
                : existingVisitor.email;

            existingVisitor.birth_date = updatedVisitor.birth_date ?? existingVisitor.birth_date;

            existingVisitor.password = !string.IsNullOrEmpty(updatedVisitor.password)
                ? updatedVisitor.password
                : existingVisitor.password;

            existingVisitor.username = !string.IsNullOrEmpty(updatedVisitor.username)
                ? updatedVisitor.username
                : existingVisitor.username;

            // Handle enum update properly
            existingVisitor.membership_status = updatedVisitor.membership_status != default
                ? updatedVisitor.membership_status
                : existingVisitor.membership_status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Visitors.Any(v => v.customer_id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE api/visitor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitor(int id)
        {
            var visitor = await _context.Visitors.FindAsync(id);
            if (visitor == null)
            {
                return NotFound();
            }

            _context.Visitors.Remove(visitor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
