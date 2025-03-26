using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendGroup.Models
{
    [Table("ticket")]
    public class Ticket
    {
        public enum TicketType
        {
            adult,
            season,
            youth,
            child,
            senior,
            student
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ticket_id { get; set; }

        // Foreign Key for User
        public int? user_id { get; set; }

        [ForeignKey("user_id")]
        [JsonIgnore]  // Prevent circular reference
        public virtual User? User { get; set; }

        // Foreign Key for Ride
        public int? ride_id { get; set; }

        [ForeignKey("ride_id")]
        [JsonIgnore]  // Prevent circular reference
        public virtual Ride? Ride { get; set; }

        public DateTime? Purchase_date { get; set; }
        public TicketType? ticket_type { get; set; }
        public decimal? Price { get; set; }
    }
}

