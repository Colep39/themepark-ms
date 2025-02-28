using Microsoft.EntityFrameworkCore;

namespace BackendGroup.Models
{
    public class ThemeParkContext : DbContext
    {
        public ThemeParkContext(DbContextOptions<ThemeParkContext> options)
            : base(options)
        {
        }
        public DbSet<Ride> Rides { get; set; }

    }
}
