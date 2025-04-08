using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

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

        [Column(TypeName = "varchar(50)")]
        [EnumDataType(typeof(mStatus))]
        public mStatus? status { get; set; }  // Make status nullable if optional

        [Key]
        public int maintenance_id { get; set; }

        public DateTime? startDate { get; set; }
        public DateTime? endDate { get; set; }

        public string description { get; set; }

        public int? maintenanceCost { get; set; }  // Nullable if optional

        [Required]  // Ensuring that ride_id is required
        public int ride_id { get; set; }

        // Make Ride navigation property optional (so it's not required in POST)
        [ForeignKey("ride_id")]
        public Ride? Ride { get; set; }
    }
}
