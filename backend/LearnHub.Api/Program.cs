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

// DbContext
var conn_string = builder.Configuration["Conn-String"]!;

builder.Services.AddDbContextFactory<LearnHubDbContext>(o => o.UseSqlServer(conn_string));

builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IDbContextFactory<LearnHubDbContext>>().CreateDbContext());

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Service registration

// Repositories
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IStudentRepo, StudentRepo>();
builder.Services.AddScoped<IProfessorRepo, ProfessorRepo>();
builder.Services.AddScoped<ICourseRepo, CourseRepo>();
builder.Services.AddScoped<IReportRepo, ReportRepo>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

// CORS Configuration
const string SpaCorsPolicy = "spa";
builder.Services.AddCors(o => o.AddPolicy(SpaCorsPolicy, 
    p => p.WithOrigins("http://localhost:5173")
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
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => {
    return "Learnhub API";
});
app.MapControllers();

app.Run();
