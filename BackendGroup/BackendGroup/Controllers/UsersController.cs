using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public UsersController(ThemeParkContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Tickets)  // Include related tickets
                .ToListAsync();
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Tickets)  // Include related tickets
                .FirstOrDefaultAsync(u => u.user_id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        
        [HttpGet("profile")]
public async Task<ActionResult<User>> GetUserProfile()
{
    var userIdClaim = User.FindFirst("UserID")?.Value;
    
    if (!int.TryParse(userIdClaim, out int userId))
    {
        return BadRequest("Invalid user ID format.");
    }

    var user = await _context.Users
        .Include(u => u.Tickets)
        .FirstOrDefaultAsync(u => u.user_id == userId);

    if (user == null)
    {
        return NotFound("User not found.");
    }

    return user;
}

        // POST: api/users
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> PostUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.user_id }, user);
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.user_id)
            {
                return BadRequest("ID mismatch.");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.first_name = updatedUser.first_name ?? existingUser.first_name;
            existingUser.last_name = updatedUser.last_name ?? existingUser.last_name;
            existingUser.email = updatedUser.email ?? existingUser.email;
            existingUser.birth_date = updatedUser.birth_date ?? existingUser.birth_date;
            existingUser.password = updatedUser.password ?? existingUser.password;
            existingUser.username = updatedUser.username ?? existingUser.username;
            existingUser.role = updatedUser.role;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
