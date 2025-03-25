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

        public DbSet<Weather> Weather { get; set;}

        public DbSet<User> Users { get; set; }

        public DbSet<Ticket> Tickets { get; set; }

        public DbSet<Maintenance> Maintenances { get; set; }

        public DbSet<Ride_log> Ride_logs { get; set; }


        // public DbSet<User_Account> User_Accounts { get; set; }  
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(v => v.role)
                .HasConversion<string>();

            modelBuilder.Entity<Ride>()
                .Property(v => v.status)
                .HasConversion<string>();

            modelBuilder.Entity<Ride>()
                .Property(v => v.type)
                .HasConversion<string>();

            modelBuilder.Entity<Ticket>()
            .Property(v => v.ticket_type)
            .HasConversion<string>();

            modelBuilder.Entity<Maintenance>()
            .Property(v => v.status)
            .HasConversion<string>();


        }

    }
}
