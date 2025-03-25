using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BackendGroup.Models
{
    [Table("events")]  
    public class Event
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] 
        public int event_id { get; set; }

        [Required]
        public DateOnly start_date { get; set; }

        [Required]
        [MaxLength(20)]
        public string event_title { get; set; } = string.Empty;

        [Required]
        public string event_description { get; set; } = string.Empty;

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EventStatus status { get; set; }

        [Required]
        public DateOnly end_date { get; set; }

        public enum EventStatus
        {
            [EnumMember(Value = "Upcoming")]
            Upcoming,
            [EnumMember(Value = "Current")]
            Current,
            [EnumMember(Value = "Passed")]
            Passed
        }
    }
}
