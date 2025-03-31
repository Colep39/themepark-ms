using System.Text.Json.Serialization;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using BackendGroup.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

var connectionString = builder.Configuration.GetConnectionString("MySqlConnection");

builder.Services.AddDbContext<ThemeParkContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Configure CORS with dynamic frontend URL
var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetRequiredService<IConfiguration>();

builder.Services.AddCors(options =>
{
    var frontendURL = configuration.GetValue<string>("frontend_url") ?? "http://localhost:5173"; 
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(frontendURL)
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://themepark-ms-git-main-cole-plagens-projects.vercel.app",
                "http://localhost:3000",  // Your React dev server
                "http://localhost:5173"    // Your Vite dev server (if used)
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();  // Important if using cookies/auth
    });
});

// Swagger configuration
builder.Services.AddSwaggerGen(c =>
{
    c.MapType<User.RoleType>(() => new OpenApiSchema
    {
        Type = "string",
        Enum = Enum.GetNames(typeof(User.RoleType))
             .Select(name => new OpenApiString(name))
             .Cast<IOpenApiAny>()
             .ToList()
    });

    c.MapType<Ticket.TicketType>(() => new OpenApiSchema
    {
        Type = "string",
        Enum = Enum.GetNames(typeof(Ticket.TicketType))
             .Select(name => new OpenApiString(name))
             .Cast<IOpenApiAny>()
             .ToList()
    });

    c.MapType<Maintenance.mStatus>(() => new OpenApiSchema
    {
        Type = "string",
        Enum = Enum.GetNames(typeof(Maintenance.mStatus))
             .Select(name => new OpenApiString(name))
             .Cast<IOpenApiAny>()
             .ToList()
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// Middleware order
app.UseRouting();
app.UseCors("AllowFrontend");  // Must come after UseRouting()
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

