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
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Ride_log> Ride_logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Convert the RideStatus enum to string 
            modelBuilder.Entity<Ride>()
                .Property(r => r.status)
                .HasConversion<string>();

            // Convert the RideType enum to string
            modelBuilder.Entity<Ride>()
                .Property(r => r.type)
                .HasConversion<string>();
        }

       
    }

}
