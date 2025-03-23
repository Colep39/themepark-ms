using System.ComponentModel.DataAnnotations;
namespace BackendGroup.Models
{
    public class Weather
    {
        [Key]
        public int weather_id { get; set; }

        [Required]
        public DateTime date { get; set; }

        [Required]
        public int rainOut { get; set; } 

        [Required]
        public decimal temperature { get; set; }
    }
}
