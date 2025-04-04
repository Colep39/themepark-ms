using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendGroup.Models
{
    [Table("Weather")]
    public class Weather
    {
        [Key]
        public int weather_id { get; set; }

        [Required]
        public DateTime date { get; set; }

        [Required]
        public bool rainOut { get; set; }  // tinyint(1) in MySQL can map to bool

        public decimal temperature { get; set; }
    }

    // DTO for monthly weather data (rainouts + average temperature)
    public class MonthlyWeatherReport
    {
        public string MonthYear { get; set; }
        public int Rainouts { get; set; }
        public decimal AverageTemperature { get; set; }
    }


    // DTO for overall or range-based weather averages
    public class WeatherAverages
    {
        public decimal AverageRainouts { get; set; }
        public decimal AverageTemperature { get; set; }
    }

    // DTO for daily weather details in a date range
    public class DailyWeatherReport
    {
        public DateTime Date { get; set; }
        public bool RainOut { get; set; }
        public decimal Temperature { get; set; }
    }
}
