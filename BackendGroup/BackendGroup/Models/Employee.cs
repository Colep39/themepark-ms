using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendGroup.Models
{
    [Table("employee")]
    public class Employee
    {
        [Key]
        public int employee_id { get; set; }

        public string employee_name { get; set; }

        public string job_position { get; set; }

        public string department { get; set; }

        public DateOnly? Hire_date { get; set; }

        public int Salary { get; set; }
    }
}
