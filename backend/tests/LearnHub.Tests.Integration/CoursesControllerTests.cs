using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace LearnHub.Tests.Integration;

public class CoursesControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly LearnHubDbContext _db;
    private readonly List<int> _createdUserIds = new();
    private readonly List<int> _createdCourseIds = new();

    // Admin credentials (seeded)
    private const string AdminUsername = "admin";
    private const string AdminPassword = "password123";

    public CoursesControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();

        _scope = _factory.Services.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
    }

    // Cleanup after each test
    public async Task DisposeAsync()
    {
        // Delete courses (and their schedules)
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

        // Delete users (only if we created any)
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
    // Get admin cookie
    private async Task<string?> GetAdminCookieAsync()
    {
        var request = new { emailOrUsername = AdminUsername, password = AdminPassword };
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var cookieHeader = response.Headers.GetValues("Set-Cookie").FirstOrDefault();
        Assert.NotNull(cookieHeader);
        Assert.Contains("access-token=", cookieHeader);
        return cookieHeader.Split(';').FirstOrDefault();
    }

    // Register a user
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

        if (isProfessor)
        {
            var user = await _db.Users.FindAsync(userId);
            Assert.NotNull(user);
            user.Role = UserRoles.Professor;

            Professor newProf = new() { UserId = user.Id, ShiftId = 1 };

            await _db.Professors.AddAsync(newProf);

            await _db.SaveChangesAsync();

            var savedProf = await _db.Professors.FirstOrDefaultAsync(p => p.UserId == userId);
            Assert.NotNull(savedProf);
        }

        return userId;
    }

    // Create a course using admin (returns course ID)
    private async Task<int> CreateCourseAsync(int professorUserId, string name, string description, CourseCategory category, decimal price, int capacity, bool isActive = true)
    {
        var adminCookie = await GetAdminCookieAsync();
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", adminCookie);

        var professor = await _db.Professors.FirstOrDefaultAsync(p => p.UserId == professorUserId);
        Assert.NotNull(professor);

        var request = new
        {
            ProfessorId = professor.Id,
            Name = name,
            Description = description,
            About = "About " + name,
            Category = category,
            Capacity = capacity,
            Certification = true,
            Hours = 40,
            Price = price
        };

        var response = await _client.PostAsJsonAsync("/api/courses", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var courseId = content.GetProperty("id").GetInt32();
        _createdCourseIds.Add(courseId);

        // If we want to set IsActive = false, we need to update after creation (since create always sets true)
        if (!isActive)
        {
            var course = await _db.Courses.FindAsync(courseId);
            Assert.NotNull(course);
            course.IsActive = false;
            await _db.SaveChangesAsync();
        }

        return courseId;
    }

    [Fact] // TC-CM-02
    public async Task GetEnabledCourses_Anonymous_ReturnsOnlyActiveCourses()
    {
        // Arrange
        // Create a professor to own courses
        var profUserId = await RegisterUserAsync("ProfCat", "One", "profcat", "profcat@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-30)).ToString("yyyy-MM-dd"), isProfessor: true);

        // Create one inactive course
        var inactiveCourseId = await CreateCourseAsync(profUserId, "Inactive Test Course", "Should not appear", CourseCategory.DataScience, 50, 20, isActive: false);
        
        // Remove any auth headers (anonymous)
        _client.DefaultRequestHeaders.Remove("Cookie");

        // Act
        var response = await _client.GetAsync("/api/Courses/enabled");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = content.GetProperty("items").EnumerateArray().ToList();
        var returnedNames = items.Select(i => i.GetProperty("name").GetString()).ToList();

        // Assert
        // Inactive course is excluded
        Assert.DoesNotContain("Inactive Test Course", returnedNames);

        // At least one known seeded active course is included
        Assert.Contains("Advanced JavaScript", returnedNames);
    }

    [Fact] // TC-CM-03
    public async Task GetEnabledCourses_SearchAndCategoryFilter_ReturnsMatchingOnly()
    {
        // Remove auth headers (anonymous)
        _client.DefaultRequestHeaders.Remove("Cookie");

        // Arrange
        var profUserId = await RegisterUserAsync("ProfFilter", "Two", "proffilter", "proffilter@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-30)).ToString("yyyy-MM-dd"), isProfessor: true);

        var testCases = new[]
        {
            // Search "JavaScript" in Programming => "Advanced JavaScript"
            (search: "JavaScript", category: CourseCategory.Programming, expected: new[] { "Advanced JavaScript" }),

            // Search "Python" with no category => "Python for Beginners" and "Data Science with Python"
            (search: "Python", category: (CourseCategory?)null, expected: new[] { "Python for Beginners", "Data Science with Python" }),

            // Search "Web" in WebDevelopment => "Full-Stack Web Development", "ASP.NET Core Web APIs"
            (search: "Web", category: CourseCategory.WebDevelopment, expected: new[] { "Full-Stack Web Development", "ASP.NET Core Web APIs" }),

            // Search "Database" with no category => "SQL and Relational Databases"
            (search: "Database", category: (CourseCategory?)null, expected: new[] { "SQL and Relational Databases" }),

            // Search "Learning" in ArtificialIntelligence => "Machine Learning Essentials", "Deep Learning with Neural Networks"
            (search: "Learning", category: CourseCategory.ArtificialIntelligence, expected: new[] { "Machine Learning Essentials", "Deep Learning with Neural Networks" }),

            // Search "DevOps" in DevOps => "DevOps and CI/CD Pipelines"
            (search: "DevOps", category: CourseCategory.DevOps, expected: new[] { "DevOps and CI/CD Pipelines" }),
        };

        // Act & Assert
        foreach (var (search, category, expected) in testCases)
        {
            var url = "/api/Courses/enabled";
            var queryParams = new List<string>();
            if (search != null)
                queryParams.Add($"searchName={Uri.EscapeDataString(search)}");
            if (category.HasValue)
                queryParams.Add($"categoryFilter={category.Value}");
            if (queryParams.Any())
                url += "?" + string.Join("&", queryParams);

            var response = await _client.GetAsync(url);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadFromJsonAsync<JsonElement>();
            var items = content.GetProperty("items").EnumerateArray().ToList();
            var returnedNames = items.Select(i => i.GetProperty("name").GetString()).ToList();

            // Assert no extra courses (should match count)
            Assert.Equal(expected.Length, returnedNames.Count);
        }
    }

    [Fact] // TC-CM-09
    public async Task GetCourses_PaginationClamping_ReturnsPage1Size50WithCorrectTotalPages()
    {
        // Arrange: create courses so we have more than 50
        var profUserId = await RegisterUserAsync("ProfPage", "Three", "profpage", "profpage@test.com", "Pass123!", DateOnly.FromDateTime(DateTime.Today.AddYears(-30)).ToString("yyyy-MM-dd"), isProfessor: true);

        var existingActiveCount = await _db.Courses.CountAsync(c => c.IsActive);
        int needed = 55 - existingActiveCount; // want at least 55 total
        if (needed > 0)
        {
            for (int i = 1; i <= needed; i++)
            {
                await CreateCourseAsync(profUserId, $"Pagination Course {i}", $"Description {i}", CourseCategory.DataScience, 100.0m, 30, isActive: true);
            }
        }

        // Login as admin
        var adminCookie = await GetAdminCookieAsync();
        _client.DefaultRequestHeaders.Remove("Cookie");
        _client.DefaultRequestHeaders.Add("Cookie", adminCookie);

        // Act: call with page=0, pageSize=999 (both out of bounds)
        var response = await _client.GetAsync("/api/courses/enabled?page=0&pageSize=999");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = content.GetProperty("items").EnumerateArray().ToList();
        var page = content.GetProperty("page").GetInt32();
        var pageSize = content.GetProperty("pageSize").GetInt32();
        var totalItems = content.GetProperty("totalItems").GetInt32();
        var totalPages = content.GetProperty("totalPages").GetInt32();

        // Assert clamping: page=0 -> 1, pageSize=999 -> 50
        Assert.Equal(1, page);
        Assert.Equal(50, pageSize);
        Assert.True(items.Count <= 50);

        // TotalItems should equal total number of active courses in the DB
        var totalActive = await _db.Courses.CountAsync(c => c.IsActive);
        Assert.Equal(totalActive, totalItems);

        // TotalPages = ceil(totalItems / pageSize) = ceil(55/50) = 2
        var expectedTotalPages = (int)Math.Ceiling((double)totalActive / 50);
        Assert.Equal(expectedTotalPages, totalPages);
    }
}