using System.ComponentModel.DataAnnotations;

namespace BackendGroup.Models
{
    public class RegisterModel
    {
        [Required]
        public string? FirstName { get; set; }

        [Required]
        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Username { get; set; }

        public DateTime? BirthDate { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}