using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace LearnHub.Tests.Integration;

public class ProfessorsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly LearnHubDbContext _db;

    private readonly List<int> _createdUserIds = new();
    private readonly List<int> _createdCourseIds = new();

    public ProfessorsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();

        _scope = _factory.Services.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
    }

    public async Task DisposeAsync()
    {
        foreach (var courseId in _createdCourseIds)
        {
            var course = await _db.Courses.FindAsync(courseId);
            if (course != null)
                _db.Courses.Remove(course);
        }

        foreach (var userId in _createdUserIds)
        {
            var user = await _db.Users
                .Include(u => u.Professor)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                if (user.Professor != null)
                    _db.Professors.Remove(user.Professor);
                _db.Users.Remove(user);
            }
        }

        await _db.SaveChangesAsync();
        _scope.Dispose();
        _client.Dispose();
    }

    public Task InitializeAsync() => Task.CompletedTask;

    private async Task<int> RegisterProfessorAsync(string username)
    {
        var request = new
        {
            FirstName = "Test",
            LastName = "Prof",
            Username = username,
            Email = $"{username}@test.com",
            Password = "Password123!",
            BirthDate = "1980-01-01"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var userId = content.GetProperty("user").GetProperty("id").GetInt32();
        _createdUserIds.Add(userId);

        var user = await _db.Users.FindAsync(userId);
        user!.Role = UserRoles.Professor;
        await _db.Professors.AddAsync(new Professor { User = user, ShiftId = 1 });
        await _db.SaveChangesAsync();

        return userId;
    }

    private async Task<string> LoginAndGetCookieAsync(string username)
    {
        var request = new { emailOrUsername = username, password = "Password123!" };
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);
        var cookieHeader = response.Headers.GetValues("Set-Cookie").FirstOrDefault();
        return cookieHeader!.Split(';').FirstOrDefault()!;
    }

    [Fact]
    public async Task GetProfessorCourses_ReturnsAssignedCourses()
    {
        // Arrange
        var username = $"profcourses{Guid.NewGuid():N}";
        var profUserId = await RegisterProfessorAsync(username);
        
        var prof = await _db.Professors.FirstOrDefaultAsync(p => p.UserId == profUserId);
        
        var course = new Course
        {
            ProfessorId = prof!.Id,
            Name = "Integration Course",
            Description = "Desc",
            CategoryName = CourseCategory.Programming,
            IsActive = true,
            Capacity = 30
        };
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        _createdCourseIds.Add(course.Id);

        var cookie = await LoginAndGetCookieAsync(username);
        _client.DefaultRequestHeaders.Add("Cookie", cookie);

        // Act
        var response = await _client.GetAsync("/api/professors/MyCourses");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        
        Assert.Equal(JsonValueKind.Array, content.ValueKind);
        Assert.Equal(1, content.GetArrayLength());
        Assert.Equal("Integration Course", content[0].GetProperty("name").GetString());
    }

    [Fact]
    public async Task GetProfessorShift_ReturnsShiftData()
    {
        // Arrange
        var username = $"profshift{Guid.NewGuid():N}";
        await RegisterProfessorAsync(username);
        var cookie = await LoginAndGetCookieAsync(username);
        _client.DefaultRequestHeaders.Add("Cookie", cookie);

        // Act
        var response = await _client.GetAsync("/api/professors/Shift");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        
        Assert.Equal(1, content.GetProperty("id").GetInt32());
        Assert.NotNull(content.GetProperty("name").GetString());
    }

    [Fact]
    public async Task GetProfessorSummary_ReturnsSummaryStats()
    {
        // Arrange
        var username = $"profsummary{Guid.NewGuid():N}";
        var profUserId = await RegisterProfessorAsync(username);
        var cookie = await LoginAndGetCookieAsync(username);
        _client.DefaultRequestHeaders.Add("Cookie", cookie);

        // Act
        var response = await _client.GetAsync("/api/professors/Summary");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        
        Assert.True(content.TryGetProperty("totalCourses", out _));
        Assert.True(content.TryGetProperty("totalStudents", out _));
        Assert.True(content.TryGetProperty("pendingSubmissionsToGrade", out _));
        Assert.True(content.TryGetProperty("topCourses", out var topCourses));
        Assert.Equal(JsonValueKind.Array, topCourses.ValueKind);
    }
}
