using System;
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
        public int ticket_id { get; set; }

        [ForeignKey("Visitor")]
        public int? visitor_id { get; set; } 

        public DateTime? Purchase_date { get; set; } 

        public TicketType? ticket_type { get; set; } 

        public decimal? Price { get; set; } 
        public virtual Visitor? Visitor { get; set; }

        [ForeignKey("Ride")]
        public int ride_id { get; set; }

        public virtual Ride? Ride { get; set; }
    }
}
