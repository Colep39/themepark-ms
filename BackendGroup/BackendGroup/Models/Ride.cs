using System.Runtime.Serialization;

namespace BackendGroup.Models
{
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
            [EnumMember(Value = "roller coaster")]
            RollerCoaster,

            [EnumMember(Value = "water ride")]
            WaterRide,

            [EnumMember(Value = "show")]
            Show
        }

        public int ride_id { get; set; }

        public string ride_name { get; set; }

        public int capacity { get; set; }

        public RideStatus status { get; set; }

        public DateTime? last_maintenance_date { get; set; }

        public int maintenance_count { get; set; }

        public RideType type { get; set; }
    }
}
