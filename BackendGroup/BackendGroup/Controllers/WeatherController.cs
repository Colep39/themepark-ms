using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;


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



        
        [HttpGet("ride-counts-by-date-range")]
            public async Task<ActionResult<IEnumerable<RideStuff>>> GetRideCountsByDateRange(
                [FromQuery] DateTime startDate, 
                [FromQuery] DateTime endDate)
            {
                try
                {
                    // Call the stored procedure using FromSqlRaw
                    var rideStats = await _context.Set<RideStuff>()
                        .FromSqlRaw("CALL GetRideCountsByDateRange({0}, {1})", startDate, endDate)
                        .ToListAsync();

                    if (rideStats == null || !rideStats.Any())
                    {
                        return NotFound("No ride data found for the given date range.");
                    }

                    return Ok(rideStats);
                }
                catch (Exception ex)
                {
                    // Log the exception (this is just a simple example, in a real app you would log this)
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }


    }
}
