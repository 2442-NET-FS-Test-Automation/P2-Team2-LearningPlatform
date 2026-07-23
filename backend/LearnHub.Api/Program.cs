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

var builder = WebApplication.CreateBuilder(args);

// Serilog Setup
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/LearnHub-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Host.UseSerilog();

// Add CourseRepo and ICourseRepo to the builder.Services
builder.Services.AddScoped<ICourseRepo, CourseRepo>();
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IReportRepo, ReportRepo>();

// DbContext
var conn_string = builder.Configuration["Conn-String"]!;

builder.Services.AddDbContextFactory<LearnHubDbContext>(o => o.UseSqlServer(conn_string));

builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IDbContextFactory<LearnHubDbContext>>().CreateDbContext());

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Services
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IStudentRepo, StudentRepo>();
builder.Services.AddScoped<IProfessorRepo, ProfessorRepo>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<ITokenService, TokenService>();

// CORS Configuration
const string SpaCorsPolicy = "spa";
builder.Services.AddCors(o => o.AddPolicy(SpaCorsPolicy, 
    p => p.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:key"];
const string jwtIssuer = "learnhub";
const string jwtAudience = "learnhub-clients";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
        ValidateLifetime = true,
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandlingMiddleware();

app.UseCors(SpaCorsPolicy);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => {
    return "Learnhub API";
});
app.MapControllers();

app.Run();
