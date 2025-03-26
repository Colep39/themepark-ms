using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendGroup.Models
{
    [Table("users")]
    public class User
    {
        public enum RoleType
        {
            Admin,
            Staff,
            Visitor
        }

        [Key]
        public int user_id { get; set; }

        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? email { get; set; }
        public DateTime? birth_date { get; set; }
        public string? password { get; set; }
        public string? username { get; set; }
        public RoleType role { get; set; }

        // Navigation property for Tickets
        public virtual ICollection<Ticket>? Tickets { get; set; }
    }
}


