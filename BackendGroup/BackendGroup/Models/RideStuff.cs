using System.ComponentModel.DataAnnotations.Schema;

namespace BackendGroup.Models
{
    public class RideStuff
    {
        [Column("ride_id")]  // match database column name
        public int RideId { get; set; }

        [Column("ride_name")]  // match database column name
        public string RideName { get; set; }

        [Column("type")]  // match database column name
        public string RideType { get; set; }

        [Column("ride_count")]  // match database column name
        public int RideCount { get; set; }
    }
}
