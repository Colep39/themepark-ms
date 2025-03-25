using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendGroup.Models
{
    [Table("maintenance")]
    public class Maintenance
    {

        public enum mStatus 
        {
            complete,
            pending
        }

        [Key]
        public int maintenance_id { get; set; }

        public DateOnly date { get; set; }

        public string description { get; set; }

        public mStatus status { get; set; }

        public int ride_id { get; set; }

        [ForeignKey("ride_id")]
        public Ride Ride { get; set; }
    }
}
