using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Import this namespace
using System.Runtime.Serialization;
using System.Text.Json.Serialization;


namespace BackendGroup.Models
{
    [Table("Ride")]  // Explicitly map to "Ride" table
    public class Ride
    {
        public enum RideStatus
        {
            operational,
            maintenance,
            closed
        }

        public enum RideType
        {
            standard,  // Corrected syntax
            water,
            kid
        }

        [Key]
        public int ride_id { get; set; }

        public string ride_name { get; set; }

        public int capacity { get; set; }

        public RideStatus status { get; set; }

        public DateOnly? last_maintenance_date { get; set; }

        public int maintenance_count { get; set; }

        public RideType type { get; set; }

        [JsonIgnore]
        public Byte[]? ride_img { get; set; }

        public int thrill_level { get; set; }
    }
}