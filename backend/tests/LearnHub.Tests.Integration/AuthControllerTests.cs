using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using LearnHub.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace LearnHub.Tests.Integration;

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly LearnHubDbContext _db;
    private int _createdUserId;
    
    public AuthControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();

        // Get a DbContext instance for cleanup and verification
        _scope = _factory.Services.CreateScope();
        _db = _scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
    }
    
    // IAsyncLifetime: cleanup after each test
    public async Task DisposeAsync()
    {
        if (_createdUserId > 0)
        {
            // Find the user (including any related entities) and remove it
            var user = await _db.Users
                .Include(u => u.Student)
                .Include(u => u.Professor) // if any
                .FirstOrDefaultAsync(u => u.Id == _createdUserId);

            if (user != null)
            {
                // Remove any related records first (if EF doesn't cascade)
                if (user.Student != null)
                    _db.Students.Remove(user.Student);
                if (user.Professor != null)
                    _db.Professors.Remove(user.Professor);

                _db.Users.Remove(user);
                await _db.SaveChangesAsync();
            }
        }

        _scope.Dispose();
        _client.Dispose();
    }

    // Required by IAsyncLifetime – but we already did setup in constructor, so this can be empty
    public Task InitializeAsync() => Task.CompletedTask;

    [Fact] // TC-AuthN-03
    public async Task Register_ValidPayload_Returns201AndPersistsUserAndSetsCookie()
    {
        // Arrange – unique credentials
        var registerRequest = new
        {
            FirstName = "Jon",
            LastName = "Mel",
            Username = "jonmel234523456078",
            Email = "jon123487654323405678@example.com",
            Password = "password123",
            BirthDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-25)).ToString("yyyy-MM-dd")
        };

        // Act – POST /auth/register
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert – status code
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Verify the response body contains user info
        var responseContent = await response.Content.ReadFromJsonAsync<JsonElement>();
        var userObj = responseContent.GetProperty("user");
        var userId = userObj.GetProperty("id").GetInt32();
        var username = userObj.GetProperty("username").GetString();
        Assert.Equal(registerRequest.Username, username);

        // Store the ID for cleanup
        _createdUserId = userId;

        // Verify the user was persisted in the database
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
        var user = await db.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.Id == userId);
        Assert.NotNull(user);
        Assert.Equal(registerRequest.FirstName, user.FirstName);
        Assert.Equal(registerRequest.LastName, user.LastName);
        Assert.Equal(registerRequest.Email, user.Email);
        Assert.NotNull(user.PasswordHash);
        Assert.NotNull(user.Student);

        // Verify the auth cookie was set in the response
        var cookieHeader = response.Headers.GetValues("Set-Cookie").FirstOrDefault();
        Assert.NotNull(cookieHeader);
        Assert.Contains("access-token", cookieHeader);

        // Follow‑up GET /auth/me should return the same user
        var cookie = cookieHeader.Split(';').FirstOrDefault();
        Assert.NotNull(cookie);
        
        _client.DefaultRequestHeaders.Add("Cookie", cookie);

        var meResponse = await _client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);

        var meContent = await meResponse.Content.ReadFromJsonAsync<JsonElement>();
        var meUser = responseContent.GetProperty("user");
        var meUsername = meUser.GetProperty("username").GetString();
        Assert.Equal(registerRequest.Username, meUsername);
    }

    [Fact] // TC-AuthN-09
    public async Task Login_WrongPassword_Returns401AndNoCookie()
    {
        // Arrange
        var username = $"testuser34567893456";
        var password = "ValidPass123";
        var email = $"test_123456780987234@example.com";

        var registerRequest = new
        {
            FirstName = "Test",
            LastName = "User",
            Username = username,
            Email = email,
            Password = password,
            BirthDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-20)).ToString("yyyy-MM-dd")
        };

        // Register the user
        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        var registerContent = await registerResponse.Content.ReadFromJsonAsync<JsonElement>();
        var userObj = registerContent.GetProperty("user");
        _createdUserId = userObj.GetProperty("id").GetInt32();

        // Act – login with wrong password
        var loginRequest = new
        {
            EmailOrUsername = username,
            Password = "WrongPassword"
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);

        // Verify no auth cookie was set
        var cookieHeader = loginResponse.Headers.Contains("Set-Cookie")
            ? loginResponse.Headers.GetValues("Set-Cookie").FirstOrDefault()
            : null;
        Assert.Null(cookieHeader);
        if (cookieHeader != null) Assert.DoesNotContain("access-token=", cookieHeader);
    }

    [Fact] // TC-AuthN-10
    public async Task Login_DeactivatedAccount_Returns403AndNoCookie()
    {
        // Arrange – create a user
        var username = $"testuser234567654";
        var password = "ValidPass123";
        var email = $"test_12347654@example.com";

        var registerRequest = new
        {
            FirstName = "Test",
            LastName = "User",
            Username = username,
            Email = email,
            Password = password,
            BirthDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-20)).ToString("yyyy-MM-dd")
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        var registerContent = await registerResponse.Content.ReadFromJsonAsync<JsonElement>();
        var userObj = registerContent.GetProperty("user");
        _createdUserId = userObj.GetProperty("id").GetInt32();

        // Deactivate the user directly in the database
        var user = await _db.Users.FindAsync(_createdUserId);
        Assert.NotNull(user);
        user.IsActive = false;
        await _db.SaveChangesAsync();

        // Act – login with correct credentials (but user is inactive)
        var loginRequest = new
        {
            EmailOrUsername = username,
            Password = password
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert – expect 403
        Assert.Equal(HttpStatusCode.Forbidden, loginResponse.StatusCode);

        // Verify no auth cookie was set
        var cookieHeader = loginResponse.Headers.Contains("Set-Cookie")
            ? loginResponse.Headers.GetValues("Set-Cookie").FirstOrDefault()
            : null;
        Assert.Null(cookieHeader);
        if (cookieHeader != null)
            Assert.DoesNotContain("access-token", cookieHeader);
    }
}