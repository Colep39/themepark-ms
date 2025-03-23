using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Import this namespace
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace BackendGroup.Models
{ 


    [Table("visitor")]
    public class Visitor
    {
        public enum MembershipStatus
        {
            Regular,
            Annual
        }

        [Key]
        public int customer_id { get; set; }

        public string? first_name { get; set; }

        public string? email { get; set; }

        public DateTime? birth_date { get; set; }

        public MembershipStatus membership_status { get; set; }    

        public string? last_name { get; set; }

        public string? password { get; set; }

        public string? username { get; set; }
    }
    


}

