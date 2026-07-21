using Microsoft.EntityFrameworkCore;
using Serilog;
using LearnHub.Data.Repositories;

using LearnHub.Data;

var builder = WebApplication.CreateBuilder(args);

// Serilog Setup
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Write to console, and write to a file - starting a new file each day.
    .WriteTo.File("logs/LearnHub-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Host.UseSerilog();

// Add CourseRepo and ICourseRepo to the builder.Services
builder.Services.AddScoped<ICourseRepo, CourseRepo>();

// DbContext
var conn_string = builder.Configuration["Conn-String"]!;

builder.Services.AddDbContextFactory<LearnHubDbContext>(o => o.UseSqlServer(conn_string));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
