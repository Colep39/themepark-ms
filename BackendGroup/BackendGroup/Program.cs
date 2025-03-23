using System.Text.Json.Serialization;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using BackendGroup.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Ensure Enums are serialized as strings
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

var connectionString = builder.Configuration.GetConnectionString("MySqlConnection");

builder.Services.AddDbContext<ThemeParkContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure Swagger to use string enums
builder.Services.AddSwaggerGen(c =>
{
    c.MapType<Visitor.MembershipStatus>(() => new OpenApiSchema
    {
        Type = "string",
        Enum = Enum.GetNames(typeof(Visitor.MembershipStatus))
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
});

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
