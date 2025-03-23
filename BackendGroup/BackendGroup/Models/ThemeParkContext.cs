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

        public DbSet<Visitor> Visitors { get; set; }

        public DbSet<Ticket> Tickets { get; set; } 

       // public DbSet<User_Account> User_Accounts { get; set; }  
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Visitor>()
                .Property(v => v.membership_status)
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
        }

    }
}
