using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

using LearnHub.Data;
using LearnHub.Data.Entities;
using System.Net.Http.Json;
using System.Net;
using System.Text.Json;

namespace LearnHub.Tests.Integration;

public class ActivitiesControllerAuthTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly LearnHubDbContext _db;

    // Admin credentials (seeded)
    private const string AdminUsername = "admin";
    private const string AdminPassword = "password123";

    // Track all created entities for cleanup
    private readonly List<int> _createdUserIds = new();
    private readonly List<int> _createdCourseIds = new();
    private readonly List<int> _createdActivityIds = new();
    private readonly List<int> _createdSubmissionIds = new();

    public ActivitiesControllerAuthTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();

        _scope = _factory.Services.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
    }

    public async Task DisposeAsync()
    {
        // Delete submissions
        foreach (var subId in _createdSubmissionIds)
        {
            var sub = await _db.ActivitySubmissions.FindAsync(subId);
            if (sub != null)
                _db.ActivitySubmissions.Remove(sub);
        }

        // Delete activities
        foreach (var actId in _createdActivityIds)
        {
            var act = await _db.Activities.FindAsync(actId);
            if (act != null)
                _db.Activities.Remove(act);
        }

        // Delete courses (and their schedules, etc.)
        foreach (var courseId in _createdCourseIds)
        {
            var course = await _db.Courses
                .Include(c => c.Schedule)
                .FirstOrDefaultAsync(c => c.Id == courseId);
            if (course != null)
            {
                if (course.Schedule != null)
                    _db.CourseSchedules.RemoveRange(course.Schedule);
                _db.Courses.Remove(course);
            }
        }

        // Delete users (students/professors)
        foreach (var userId in _createdUserIds)
        {
            var user = await _db.Users
                .Include(u => u.Student)
                .Include(u => u.Professor)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                if (user.Student != null)
                    _db.Students.Remove(user.Student);
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

    // Helpers

    // Get the admin's authentication cookie
    private async Task<string?> GetAdminCookieAsync()
    {
        var request = new { emailOrUsername = AdminUsername, Password = AdminPassword };
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var cookieHeader = response.Headers.GetValues("Set-Cookie").FirstOrDefault();
        Assert.NotNull(cookieHeader);
        Assert.Contains("access-token=", cookieHeader);
        return cookieHeader.Split(';').FirstOrDefault();
    }

    // Register a user and return the user ID (also adds to cleanup list)
    private async Task<int> RegisterUserAsync(string firstName, string lastName, string username, string email, string password, string birthDate, bool isProfessor = false)
    {
        var request = new
        {
            FirstName = firstName,
            LastName = lastName,
            Username = username,
            Email = email,
            Password = password,
            BirthDate = birthDate
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var userObj = content.GetProperty("user");
        var userId = userObj.GetProperty("id").GetInt32();
        _createdUserIds.Add(userId);

        // If professor, promote the user to Professor role in the database
        if (isProfessor)
        {
            var user = await _db.Users.FindAsync(userId);
            Assert.NotNull(user);
            user.Role = UserRoles.Professor;

            Professor newProf = new() { User = user, ShiftId=1 };

            await _db.Professors.AddAsync(newProf);

            await _db.SaveChangesAsync();
        }

        return userId;
    }

    // Login a user and return the cookie header value (for subsequent requests)
    private async Task<string?> LoginAndGetCookieAsync(string emailOrUsername, string password)
    {
        var request = new { emailOrUsername, password };
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var cookieHeader = response.Headers.GetValues("Set-Cookie").FirstOrDefault();
        Assert.NotNull(cookieHeader);
        Assert.Contains("access-token=", cookieHeader);
        return cookieHeader.Split(';').FirstOrDefault();
    }

    // Create a course with a specific professor (by user ID)
    private async Task<int> CreateCourseAsync(int professorUserId, string name = "Test Course")
    {
        // Set Admin Cookie for Course creation
        var adminCookie = await GetAdminCookieAsync();
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", adminCookie);

        // Need to know the professor's entity ID (Professor.Id, not User.Id)
        var professor = await _db.Professors.FirstOrDefaultAsync(p => p.UserId == professorUserId);
        Assert.NotNull(professor);

        var request = new
        {
            ProfessorId = professor.Id,
            Name = name,
            Description = "Test description",
            About = "Test about",
            Category = CourseCategory.DataScience,
            Capacity = 30,
            Certification = true,
            Hours = 40,
            Price = 100.0m
        };

        var response = await _client.PostAsJsonAsync("/api/courses", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var courseId = content.GetProperty("id").GetInt32();
        _createdCourseIds.Add(courseId);
        return courseId;
    }

    // Create an activity for a course (by course ID)
    private async Task<int> CreateActivityAsync(int courseId, string title = "Test Activity", DateTime? dueDate = null)
    {
        var request = new
        {
            CourseId = courseId,
            Title = title,
            Description = "Test description",
            DueDate = (dueDate ?? DateTime.UtcNow.AddDays(7)).ToString("o")
        };

        var response = await _client.PostAsJsonAsync("/api/activities", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var activityId = content.GetProperty("id").GetInt32();
        _createdActivityIds.Add(activityId);
        return activityId;
    }

    [Fact] // TC-AuthZ-02
    public async Task CreateActivity_ProfessorNotTeachingCourse_Returns403()
    {
        // Arrange
        // Create Professor A
        var profAUserId = await RegisterUserAsync("ProfA", "One", "profa", "profa@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-25)).ToString("yyyy-MM-dd"), isProfessor: true);

        // Create Professor B
        var profBUserId = await RegisterUserAsync("ProfB", "Two", "profb", "profb@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-30)).ToString("yyyy-MM-dd"), isProfessor: true);

        // Create a course taught by Professor B (using admin)
        await CreateCourseAsync(profBUserId, "Course by B");

        // Login as Professor A
        var profACookie = await LoginAndGetCookieAsync("profa", "Pass123!");
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", profACookie);

        // Get the course ID (last one that was created)
        var course = await _db.Courses
            .OrderByDescending(c => c.Id)
            .FirstOrDefaultAsync();
        Assert.NotNull(course);

        // Try to create an activity for that course
        var activityRequest = new
        {
            CourseId = course.Id,
            Title = "Activity by A on B's course",
            Description = "Should fail",
            DueDate = DateTime.UtcNow.AddDays(7).ToString("o")
        };

        var response = await _client.PostAsJsonAsync("/api/activities", activityRequest);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);

        // Verify no activity was created in the DB for that course
        var activitiesCount = await _db.Activities.CountAsync(a => a.CourseId == course.Id);
        Assert.Equal(0, activitiesCount);
    }

    [Fact] // TC-AuthZ-03
    public async Task SubmitActivity_StudentNotEnrolled_Returns403()
    {
        // Arrange
        // Create a Professor and a course with an activity
        var profUserId = await RegisterUserAsync("ProfC", "Three", "profc", "profc@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-30)).ToString("yyyy-MM-dd"), isProfessor: true);
        var profCookie = await LoginAndGetCookieAsync("profc", "Pass123!");
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", profCookie);
        var courseId = await CreateCourseAsync(profUserId, "Course with activity");
        var activityId = await CreateActivityAsync(courseId, "Submit test");

        // Create a Student (not enrolled)
        var studentUserId = await RegisterUserAsync("StudentX", "X", "studentx", "studentx@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-18)).ToString("yyyy-MM-dd"), isProfessor: false);
        var studentCookie = await LoginAndGetCookieAsync("studentx", "Pass123!");
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", studentCookie);

        // Act – attempt to submit to the activity
        var submissionRequest = new { File = "http://example.com/submission.pdf" };
        var response = await _client.PostAsJsonAsync($"/api/activities/{activityId}/submissions", submissionRequest);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);

        // Verify no submission was created
        var submissions = await _db.ActivitySubmissions.CountAsync(s => s.ActivityId == activityId);
        Assert.Equal(0, submissions);
    }

    [Fact] // TC-AuthZ-04
    public async Task Admin_CanCreateAndDeleteActivity_ForAnyCourse()
    {
        // Arrange
        // Create a Professor and a course (we'll use the same professor for simplicity, but Admin doesn't need ownership)
        var profUserId = await RegisterUserAsync("ProfD", "Four", "profd", "profd@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-30)).ToString("yyyy-MM-dd"), isProfessor: true);
        var profCookie = await LoginAndGetCookieAsync("profd", "Pass123!");
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", profCookie);
        var courseId = await CreateCourseAsync(profUserId, "Course for admin test");

        // Create an Admin user (we need to set role Admin in DB)
        var adminUserId = await RegisterUserAsync("Admin", "User", "adminuser", "admin@test.com", "AdminPass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-25)).ToString("yyyy-MM-dd"));
        var adminUser = await _db.Users.FindAsync(adminUserId);
        Assert.NotNull(adminUser);
        adminUser.Role = UserRoles.Admin;
        await _db.SaveChangesAsync();

        // Login as Admin
        var adminCookie = await LoginAndGetCookieAsync("adminuser", "AdminPass123!");
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", adminCookie);

        // Act – Admin creates an activity for the course
        var activityRequest = new
        {
            CourseId = courseId,
            Title = "Admin-created activity",
            Description = "Admin can create",
            DueDate = DateTime.UtcNow.AddDays(7).ToString("o")
        };
        var createResponse = await _client.PostAsJsonAsync("/api/activities", activityRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createContent = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var activityId = createContent.GetProperty("id").GetInt32();
        _createdActivityIds.Add(activityId); // track for cleanup

        // Admin deletes the same activity
        var deleteResponse = await _client.DeleteAsync($"/api/activities/{activityId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Verify activity was soft deleted
        var activity = await _db.Activities.FirstAsync(a => a.Id == activityId);
        Assert.False(activity.IsActive);
    }
}