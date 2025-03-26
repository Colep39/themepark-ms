using BackendGroup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ThemeParkContext _context;
        private readonly IConfiguration _config;

        public AuthController(ThemeParkContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // Sign up
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (await _context.Users.AnyAsync(u => u.email == model.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            var newUser = new User
            {
                first_name = model.FirstName,
                last_name = model.LastName,
                email = model.Email,
                birth_date = model.BirthDate,
                username = model.Username,
                password = model.Password,      //
                role = BackendGroup.Models.User.RoleType.Visitor // Explicit namespace   // default visitor?
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully with role: Visitor." });
        }

        // Login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.username == model.Username && u.password == model.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token, role = user.role.ToString() });
        }

        // JWT Token generation method
        private string GenerateJwtToken(User user)
        {
            // Check for null or empty JWT Key
            var jwtKey = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var expireMinutes = _config.GetValue<int>("Jwt:ExpireMinutes");

            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is missing from the configuration.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.username),
        new Claim(JwtRegisteredClaimNames.Email, user.email ?? string.Empty),
        new Claim(ClaimTypes.Role, user.role.ToString()),   // Role claim
        new Claim("UserID", user.user_id.ToString())
    };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expireMinutes), // Use the configured expiration time
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}