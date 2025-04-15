using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;

using System.Threading.Tasks;
using BackendGroup.Models;
using MySql.Data.MySqlClient;

namespace BackendGroup.Controllers
{
    [Route("api/weather")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly ThemeParkContext _context;
        private readonly IConfiguration _configuration;

        public WeatherController(ThemeParkContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ Get Rainouts and Temperature for All Months
        [HttpGet("monthly-report")]
        public async Task<ActionResult<IEnumerable<MonthlyWeatherReport>>> GetMonthlyReport()
        {
            var report = await _context.Set<MonthlyWeatherReport>()
                .FromSqlRaw("CALL GetMonthlyRainoutsAndTemperature()")
                .ToListAsync();

            return Ok(report);
        }

        // ✅ Get Average Rainouts and Temperature for All Months
        [HttpGet("monthly-averages")]
        public async Task<ActionResult<IEnumerable<WeatherAverages>>> GetMonthlyAverages()
        {
            var averages = await _context.Set<WeatherAverages>()
                .FromSqlRaw("CALL GetOverallWeatherAverages()")
                .ToListAsync();

            return Ok(averages);
        }

        // ✅ Get Rainouts and Temperature Within a Date Range
        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<DailyWeatherReport>>> GetWeatherByDateRange(
            [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start > end)
            {
                return BadRequest("Start date must be before end date.");
            }

            var report = await _context.Set<DailyWeatherReport>()
                .FromSqlRaw("CALL GetDailyWeatherByDateRange({0}, {1})", start, end)
                .ToListAsync();

            return Ok(report);
        }

        // ✅ Get Average Rainouts and Temperature for a Date Range
        [HttpGet("date-range-averages")]
        public async Task<ActionResult<IEnumerable<WeatherAverages>>> GetDateRangeAverages(
            [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start > end)
            {
                return BadRequest("Start date must be before end date.");
            }

            var averages = await _context.Set<WeatherAverages>()
                .FromSqlRaw("CALL GetAverageWeatherByDateRange({0}, {1})", start, end)
                .ToListAsync();

            return Ok(averages);
        }

        // ✅ Add New Weather Data
        [HttpPost]
        public async Task<ActionResult<Weather>> PostWeatherData(Weather weather)
        {
            _context.Weather.Add(weather);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWeatherByDateRange), new { id = weather.weather_id }, weather);
        }

        // ✅ Update Weather Data by ID
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

        // ✅ Delete Weather Data by ID
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

        // Get All Weather Data
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Weather>>> GetAllWeather()
        {
            var weatherData = await _context.Weather.ToListAsync();
            return Ok(weatherData);
        }

        // Get Weather Data by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Weather>> GetWeatherById(int id)
        {
            var weather = await _context.Weather.FindAsync(id);

            if (weather == null)
            {
                return NotFound($"Weather data with ID {id} not found.");
            }

            return Ok(weather);
        }



        [HttpGet("ride-stats")]
        public async Task<IActionResult> GetRideStats([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var result = new RideStatsDashboard();

            string connStr = _configuration.GetConnectionString("MySqlConnection");

            using var conn = new MySqlConnection(connStr);
            await conn.OpenAsync();

            using var cmd = new MySqlCommand("GetRideStatsDashboard", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@start_date", startDate);
            cmd.Parameters.AddWithValue("@end_date", endDate);

            using var reader = await cmd.ExecuteReaderAsync();

            // 1. Ride stats
            while (await reader.ReadAsync())
            {
                result.RideStats.Add(new RideStat
                {
                    RideName = reader["ride_name"].ToString(),
                    RideType = reader["type"].ToString(),
                    RideCount = Convert.ToInt32(reader["total_ride_count"]),
                    RideDate = Convert.ToDateTime(reader["ride_date"]),
                    Temperature = Convert.ToDecimal(reader["temperature"]),
                    RainOut = Convert.ToBoolean(reader["rainOut"])
                });
            }

            // 2. Top 3 rides
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.TopRides.Add(new TopRide
                {
                    RideName = reader["ride_name"].ToString(),
                    TotalRideCount = Convert.ToInt32(reader["total_ride_count"])
                });
            }

            // 3. Most popular ride type
            await reader.NextResultAsync();
            if (await reader.ReadAsync())
            {
                result.MostPopularType = reader["type"].ToString();
                result.MostPopularTypeCount = Convert.ToInt32(reader["total_ride_count"]); // Add this line
            }

            // 4. Average temperature
            await reader.NextResultAsync();
            if (await reader.ReadAsync())
            {
                result.AvgTemp = Convert.ToDouble(reader["avg_temperature"]);
            }

            // 5. Total rainouts
            await reader.NextResultAsync();
            if (await reader.ReadAsync())
            {
                result.TotalRainouts = Convert.ToInt32(reader["total_rainouts"]);
            }

            return Ok(result);
        }





    }
}
