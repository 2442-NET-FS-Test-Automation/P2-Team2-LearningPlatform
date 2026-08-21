using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace LearnHub.Tests.Integration;

public class ActivitiesControllerProfessorIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly LearnHubDbContext _db;

    private readonly List<int> _createdUserIds = new();
    private readonly List<int> _createdCourseIds = new();
    private readonly List<int> _createdActivityIds = new();

    public ActivitiesControllerProfessorIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();

        _scope = _factory.Services.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
    }

    public async Task DisposeAsync()
    {
        foreach (var actId in _createdActivityIds)
        {
            var act = await _db.Activities.FindAsync(actId);
            if (act != null) _db.Activities.Remove(act);
        }

        foreach (var courseId in _createdCourseIds)
        {
            var course = await _db.Courses.FindAsync(courseId);
            if (course != null) _db.Courses.Remove(course);
        }

        foreach (var userId in _createdUserIds)
        {
            var user = await _db.Users
                .Include(u => u.Professor)
                .Include(u => u.Student)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user != null)
            {
                if (user.Professor != null) _db.Professors.Remove(user.Professor);
                if (user.Student != null) _db.Students.Remove(user.Student);
                _db.Users.Remove(user);
            }
        }

        await _db.SaveChangesAsync();
        _scope.Dispose();
        _client.Dispose();
    }

    public Task InitializeAsync() => Task.CompletedTask;

    private async Task<int> RegisterUserAsync(string username, bool isProfessor = false, bool isStudent = false)
    {
        var request = new
        {
            FirstName = "Test",
            LastName = "User",
            Username = username,
            Email = $"{username}@test.com",
            Password = "Password123!",
            BirthDate = "1990-01-01"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var userId = content.GetProperty("user").GetProperty("id").GetInt32();
        _createdUserIds.Add(userId);

        var user = await _db.Users.FindAsync(userId);
        if (isProfessor)
        {
            user!.Role = UserRoles.Professor;
            await _db.Professors.AddAsync(new Professor { User = user, ShiftId = 1 });
        }
        else if (isStudent)
        {
            user!.Role = UserRoles.Student;
            await _db.Students.AddAsync(new Student { User = user, BirthDate = DateOnly.Parse("1990-01-01") });
        }
        
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
    public async Task CreateActivity_ValidData_ReturnsCreated()
    {
        // Arrange
        var username = $"profact1{Guid.NewGuid():N}";
        var profUserId = await RegisterUserAsync(username, isProfessor: true);
        var prof = await _db.Professors.FirstOrDefaultAsync(p => p.UserId == profUserId);
        
        var course = new Course
        {
            ProfessorId = prof!.Id,
            Name = "Act Course",
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

        var request = new
        {
            CourseId = course.Id,
            Title = "New Activity",
            Description = "Do the homework",
            DueDate = DateTime.UtcNow.AddDays(5).ToString("o")
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/activities", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var actId = content.GetProperty("id").GetInt32();
        _createdActivityIds.Add(actId);
        
        Assert.Equal("New Activity", content.GetProperty("title").GetString());
    }

    [Fact]
    public async Task DeleteAndReactivateActivity_WorksProperly()
    {
        // Arrange
        var username = $"profact2{Guid.NewGuid():N}";
        var profUserId = await RegisterUserAsync(username, isProfessor: true);
        var prof = await _db.Professors.FirstOrDefaultAsync(p => p.UserId == profUserId);
        
        var course = new Course
        {
            ProfessorId = prof!.Id,
            Name = "Act Course 2",
            Description = "Desc",
            CategoryName = CourseCategory.Programming,
            IsActive = true,
            Capacity = 30
        };
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        _createdCourseIds.Add(course.Id);

        var activity = new Activity
        {
            CourseId = course.Id,
            CreatedByUserId = profUserId,
            Title = "To Delete",
            Description = "Desc",
            DueDate = DateTime.UtcNow.AddDays(2),
            IsActive = true
        };
        _db.Activities.Add(activity);
        await _db.SaveChangesAsync();
        _createdActivityIds.Add(activity.Id);

        var cookie = await LoginAndGetCookieAsync(username);
        _client.DefaultRequestHeaders.Add("Cookie", cookie);

        // Act - Delete
        var delResponse = await _client.DeleteAsync($"/api/activities/{activity.Id}");
        
        // Assert - Delete
        Assert.Equal(HttpStatusCode.NoContent, delResponse.StatusCode);
        var actDb = await _db.Activities.AsNoTracking().FirstOrDefaultAsync(a => a.Id == activity.Id);
        Assert.False(actDb!.IsActive);

        // Act - Reactivate
        var reactResponse = await _client.PatchAsync($"/api/activities/{activity.Id}/reactivate", null);
        
        // Assert - Reactivate
        Assert.Equal(HttpStatusCode.NoContent, reactResponse.StatusCode);
        var actDb2 = await _db.Activities.AsNoTracking().FirstOrDefaultAsync(a => a.Id == activity.Id);
        Assert.True(actDb2!.IsActive);
    }
}
