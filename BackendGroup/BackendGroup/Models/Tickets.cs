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
            Adult,
            Season,
            Youth,
            Child,
            Senior,
            Student
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

// DTO for ticket report data
public class TicketReport
{
    public int TicketId { get; set; }
    public string UserName { get; set; }
    public string RideName { get; set; }
    public DateTime PurchaseDate { get; set; }
    public string TicketType { get; set; }
    public decimal Price { get; set; }
}

// DTO for ticket statistics
public class TicketStatistics
{
    public int TotalTickets { get; set; } = 0;
    public decimal TotalRevenue { get; set; } = 0;
    public Dictionary<string, int> TicketsByType { get; set; } = new Dictionary<string, int>();
}

// New separate class for top rides
public class TopRideStatistics
{
    public string RideName { get; set; }
    public int RideCount { get; set; }
}

