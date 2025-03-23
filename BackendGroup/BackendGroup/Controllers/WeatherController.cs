using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;

namespace BackendGroup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public WeatherController(ThemeParkContext context)
        {
            _context = context;
        }

        // GET: api/weather
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Weather>>> GetWeather()
        {
            return await _context.Weather.ToListAsync();
        }

        // GET: api/weather/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Weather>> GetWeather(int id)
        {
            var weather = await _context.Weather.FindAsync(id);

            if (weather == null)
            {
                return NotFound();
            }

            return weather;
        }

        // POST: api/weather
        [HttpPost]
        public async Task<ActionResult<Weather>> PostWeather(Weather weather)
        {
            _context.Weather.Add(weather);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWeather), new { id = weather.weather_id }, weather);
        }

        // PUT: api/weather/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWeather(int id, Weather updatedWeather)
        {
            if (id != updatedWeather.weather_id)
            {
                return BadRequest();
            }

            var existingWeather = await _context.Weather.FindAsync(id);
            if (existingWeather == null)
            {
                return NotFound();
            }

            // Only update fields that are provided (avoid overwriting with defaults)
            existingWeather.date = updatedWeather.date != default ? updatedWeather.date : existingWeather.date;
            existingWeather.rainOut = updatedWeather.rainOut != default ? updatedWeather.rainOut : existingWeather.rainOut;
            existingWeather.temperature = updatedWeather.temperature != default ? updatedWeather.temperature : existingWeather.temperature;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Weather.Any(w => w.weather_id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/weather/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWeather(int id)
        {
            var weather = await _context.Weather.FindAsync(id);

            if (weather == null)
            {
                return NotFound();
            }

            _context.Weather.Remove(weather);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

