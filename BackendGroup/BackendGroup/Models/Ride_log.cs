using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Import this namespace
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation; 

namespace BackendGroup.Models
{
    [Table("ride_logs")]
    public class Ride_log
    {
        [Key]
        public int log_id { get; set; }

        public DateTime date { get; set; }

        public int ride_count { get; set; }

        public int ride_id { get; set; }

        
        [ForeignKey("ride_id")]
        [JsonIgnore]
        [ValidateNever]
        public Ride Ride { get; set; }
    }
}
