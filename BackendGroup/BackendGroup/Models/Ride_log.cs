using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendGroup.Models
{
    [Table("ride_log")]
    public class Ride_log
    {
        [Key]
        public int log_id { get; set; }

        public DateTime date { get; set; }

        public int ride_count { get; set; }

        public int ride_id { get; set; }

        [ForeignKey("ride_id")]
        public Ride Ride { get; set; }
    }
}
