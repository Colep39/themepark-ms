using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendGroup.Models;

namespace BackendGroup.Controllers
{
    [Route("api/weather")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly ThemeParkContext _context;

        public WeatherController(ThemeParkContext context)
        {
            _context = context;
        }

        // GET all weather data
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Weather>>> GetAllWeather()
        {
            var weatherData = await _context.Weather.ToListAsync();

            if (!weatherData.Any())
            {
                return NotFound("No weather data found.");
            }

            return Ok(weatherData);
        }

        // GET weather data within a date range
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Weather>>> GetWeatherData([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start > end)
            {
                return BadRequest("Start date must be before end date.");
            }

            var weatherData = await _context.Weather
                .Where(w => w.date >= start && w.date <= end)
                .ToListAsync();

            if (!weatherData.Any())
            {
                return NotFound("No weather data found for the selected range.");
            }

            return Ok(weatherData);
        }

        // POST - Add new weather data
        [HttpPost]
        public async Task<ActionResult<Weather>> PostWeatherData(Weather weather)
        {
            _context.Weather.Add(weather);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWeatherData), new { id = weather.weather_id }, weather);
        }

        // PUT - Update weather data by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWeather(int id, Weather updatedWeather)
        {
            if (id != updatedWeather.weather_id)
            {
                return BadRequest("Weather ID mismatch.");
            }

            var existingWeather = await _context.Weather.FindAsync(id);
            if (existingWeather == null)
            {
                return NotFound("Weather data not found.");
            }

            // Update properties
            existingWeather.date = updatedWeather.date;
            existingWeather.rainOut = updatedWeather.rainOut;
            existingWeather.temperature = updatedWeather.temperature;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "An error occurred while updating the weather data.");
            }

            return NoContent();
        }

        // DELETE - Remove weather data by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWeather(int id)
        {
            var weather = await _context.Weather.FindAsync(id);
            if (weather == null)
            {
                return NotFound("Weather data not found.");
            }

            _context.Weather.Remove(weather);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
