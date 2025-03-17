﻿// <auto-generated />
using System;
using BackendGroup.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BackendGroup.Migrations
{
    [DbContext(typeof(ThemeParkContext))]
    [Migration("20250311020423_AddRidePrimaryKey")]
    partial class AddRidePrimaryKey
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("BackendGroup.Models.Ride", b =>
                {
                    b.Property<int>("ride_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("ride_id"));

                    b.Property<int>("capacity")
                        .HasColumnType("int");

                    b.Property<DateTime?>("last_maintenance_date")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("maintenance_count")
                        .HasColumnType("int");

                    b.Property<string>("ride_name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("status")
                        .HasColumnType("int");

                    b.Property<int>("type")
                        .HasColumnType("int");

                    b.HasKey("ride_id");

                    b.ToTable("Rides");
                });
#pragma warning restore 612, 618
        }
    }
}
