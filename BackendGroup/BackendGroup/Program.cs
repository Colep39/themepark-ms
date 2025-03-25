using Microsoft.EntityFrameworkCore;
using BackendGroup.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services for API controllers
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.SuppressModelStateInvalidFilter = true;
    });

// Get MySQL connection string from config
var connectionString = builder.Configuration.GetConnectionString("MySqlConnection");

// Configure DbContext with MySQL
builder.Services.AddDbContext<ThemeParkContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build service provider to access configuration
var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetRequiredService<IConfiguration>();

// Configure CORS
builder.Services.AddCors(options =>
{
    var frontendURL = configuration.GetValue<string>("frontend_url") ?? "http://localhost:5173"; // Default to localhost
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendURL)
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Enable Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enforce HTTPS
app.UseHttpsRedirection();

// Enable CORS
app.UseCors();

// Enable authorization middleware
app.UseAuthorization();

// Map API controller routes
app.MapControllers();

// Start the app
app.Run();
