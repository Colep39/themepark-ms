﻿using Microsoft.EntityFrameworkCore;
using System;

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
        public DbSet<Shop> Shops { get; set; }

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

            // Add shop configuration with value converter
            modelBuilder.Entity<Shop>()
                .Property(s => s.shop_name)
                .HasConversion(
                    v => v.ToString().Replace('_', ' '), // Convert enum to string, replacing _ with space
                    v => (Shop.ShopName)Enum.Parse(typeof(Shop.ShopName), v.Replace(" ", "_")) // Convert string to enum, replacing space with _
                );

            // Configure status to map between bool and bit
            modelBuilder.Entity<Shop>()
                .Property(s => s.status)
                .HasConversion<int>();  // Changed from byte to int
        }


    }

}
