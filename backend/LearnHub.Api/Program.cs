using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Serilog;
using LearnHub.Data.Repositories;

using LearnHub.Data;
using LearnHub.Api.Services;
using LearnHub.Data.Entities;
using LearnHub.Api.Middleware;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// Serilog Setup
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/LearnHub-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Host.UseSerilog();

// DbContext
var conn_string = builder.Configuration["Conn-String"]!;

builder.Services.AddDbContextFactory<LearnHubDbContext>(o => o.UseSqlServer(conn_string));

builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IDbContextFactory<LearnHubDbContext>>().CreateDbContext());

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Services
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IStudentRepo, StudentRepo>();
builder.Services.AddScoped<IProfessorRepo, ProfessorRepo>();
builder.Services.AddScoped<ICourseRepo, CourseRepo>();
builder.Services.AddScoped<IReportRepo, ReportRepo>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ISeeder, Seeder>();

builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

// CORS Configuration
const string SpaCorsPolicy = "spa";
builder.Services.AddCors(o => o.AddPolicy(SpaCorsPolicy, 
    p => p.WithOrigins("http://localhost:5173", "http://localhost:5174")
        .AllowAnyHeader()
        .AllowAnyMethod()));

// JWT Authentication
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection(JwtSettings.SectionName)
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandlingMiddleware();

app.UseCors(SpaCorsPolicy);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => {
    return "Learnhub API";
});

// Test Endpoints for Role Enforcement
app.MapGet("/api/test-protected", () => {
    return Results.Ok(new { message = "You are authenticated!" });
}).RequireAuthorization();

app.MapGet("/api/test-admin", () => {
    return Results.Ok(new { message = "You have Admin access!" });
}).RequireAuthorization(new Microsoft.AspNetCore.Authorization.AuthorizeAttribute { Roles = "Admin" });
app.MapControllers();

app.Run();
