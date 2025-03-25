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
}
