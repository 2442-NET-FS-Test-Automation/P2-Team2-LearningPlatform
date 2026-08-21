using System.Net;
using System.Net.Http.Json;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Transactions;
using FluentAssertions;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Api.DTOs.Users;
using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace LearnHub.Tests;


public class UserControllerTests : IClassFixture<TestApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly LearnHubDbContext _context;
    private IDbContextTransaction? _transaction;

    public UserControllerTests(TestApplicationFactory factory)
    {
        _client = factory.CreateClient();

        var scope = factory.Services.CreateScope();
        _context = scope.ServiceProvider
            .GetRequiredService<LearnHubDbContext>();
    }

    // TC-UserMgmt-01: Get users list as Admin
    [Fact]
    public async Task TC_UserMgmt_01_GetUsers_AdminCanViewUsersList()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.GetAsync("/api/Users");

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var users = await response.Content.ReadFromJsonAsync<PagedResult<UserDto>>();

            users.Should().NotBeNull();
            users!.Items.Should().NotBeEmpty();
            users.Items.Should().AllSatisfy(u =>
            {
                u.Id.Should().BeGreaterThan(0);
                u.Username.Should().NotBeNullOrEmpty();
                u.Email.Should().NotBeNullOrEmpty();
                u.Role.Should().NotBeNullOrEmpty();
            });
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-02: Create new user as Admin
    [Fact]
    public async Task TC_UserMgmt_02_CreateUser_AdminCanCreateUserSuccessfully()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var dto = new CreateUserDto
            {
                Username = "newuser_test_" + Guid.NewGuid().ToString().Substring(0, 8),
                Email = "newuser_" + Guid.NewGuid().ToString().Substring(0, 8) + "@test.com",
                FirstName = "Test",
                LastName = "User",
                Password = "TestPassword123!",
                BirthDate = new DateOnly(2000, 1, 1)
            };

            var response = await _client.PostAsJsonAsync("/api/Users", dto);

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var createdUser = await response.Content.ReadFromJsonAsync<JsonElement>();

            createdUser.ValueKind.Should().Be(JsonValueKind.Object);
            createdUser.TryGetProperty("user", out _).Should().BeTrue();

            var userInDb = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            userInDb.Should().NotBeNull();
            userInDb!.Email.Should().Be(dto.Email);
            userInDb.FirstName.Should().Be(dto.FirstName);
            userInDb.LastName.Should().Be(dto.LastName);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-03: Update user information as Admin
    [Fact]
    public async Task TC_UserMgmt_03_UpdateUser_AdminCanUpdateUserInformation()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRoles.Student);

            user.Should().NotBeNull();

            var userId = user!.Id;

            var dto = new UpdateUserDto
            {
                FirstName = "Updated",
                LastName = "Name",
                Bio = "Updated bio information"
            };

            var response = await _client.PatchAsJsonAsync($"/api/Users/{userId}", dto);

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var updatedUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            updatedUser.Should().NotBeNull();
            updatedUser!.FirstName.Should().Be(dto.FirstName);
            updatedUser.LastName.Should().Be(dto.LastName);
            updatedUser.Bio.Should().Be(dto.Bio);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-04: Deactivate user as Admin
    [Fact]
    public async Task TC_UserMgmt_04_DeleteUser_AdminCanDeactivateUserSuccessfully()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRoles.Student);

            user.Should().NotBeNull();

            var userId = user!.Id;

            var response = await _client.DeleteAsync($"/api/Users/{userId}");

            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var deletedUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            deletedUser.Should().NotBeNull();
            deletedUser!.IsActive.Should().BeFalse();
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-05: Unauthorized access as non-admin user
    [Fact]
    public async Task TC_UserMgmt_05_UpdateUser_StudentCannotManageUsers()
    {
        _client.LoginAsStudent();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRoles.Student);

            user.Should().NotBeNull();

            var userId = user!.Id;

            var dto = new UpdateUserDto
            {
                FirstName = "Unauthorized",
                LastName = "Attempt"
            };

            var response = await _client.PatchAsJsonAsync($"/api/Users/{userId}", dto);

            response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-06: Assign professor to course
    [Fact]
    public async Task TC_UserMgmt_06_UpdateUser_AssignProfessorToCourse_ShouldAssignProfessorSuccesfully()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var professor = await _context.Professors.FirstOrDefaultAsync();

            professor.Should().NotBeNull();

            var course = await _context.Courses.FirstOrDefaultAsync();

            course.Should().NotBeNull();

            var professorUserId = professor!.UserId;
            var courseId = course!.Id;

            var dto = new UpdateUserDto
            {
                ProfessorCourseIds = new List<int>
                {
                    courseId
                }
            };

            var response = await _client.PatchAsJsonAsync($"/api/Users/{professorUserId}", dto);

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var updatedCourse = await _context.Courses
                .Include(c => c.Professor)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            updatedCourse.Should().NotBeNull();
            updatedCourse!.ProfessorId.Should().Be(professor.Id);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-07: Promote student to professor
    [Fact]
    public async Task TC_UserMgmt_07_PromoteToProfessor_AdminCanPromoteStudentToProfessor()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRoles.Student);

            student.Should().NotBeNull();

            var studentId = student!.Id;

            var shift = await _context.Shifts.FirstOrDefaultAsync();
            shift.Should().NotBeNull();

            var dto = new PromoteProfessorDto
            {
                ShiftId = shift!.Id,
                ContractDate = DateOnly.FromDateTime(DateTime.Now)
            };

            var response = await _client.PostAsJsonAsync($"/api/Users/{studentId}/promote", dto);

            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var promotedUser = await _context.Users
                .AsNoTracking()
                .Include(u => u.Professor)
                .FirstOrDefaultAsync(u => u.Id == studentId);

            promotedUser.Should().NotBeNull();
            promotedUser!.Role.Should().Be(UserRoles.Professor);
            promotedUser.Professor.Should().NotBeNull();
            promotedUser.Professor!.ShiftId.Should().Be(dto.ShiftId);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-07: Reject promotion with invalid professor information
    [Fact]
    public async Task TC_UserMgmt_07_PromoteToProfessor_InvalidProfessorInformationIsRejected()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var student = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Role == UserRoles.Student);

            student.Should().NotBeNull();

            var response = await _client.PostAsJsonAsync(
                $"/api/Users/{student!.Id}/promote",
                new PromoteProfessorDto
                {
                    ShiftId = 99999,
                    ContractDate = default
                });

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var unchangedStudent = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == student.Id);

            unchangedStudent!.Role.Should().Be(UserRoles.Student);
            (await _context.Professors.AsNoTracking()
                .AnyAsync(p => p.UserId == student.Id)).Should().BeFalse();
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-08: Reactivate deactivated user
    [Fact]
    public async Task TC_UserMgmt_08_ReactivateUser_AdminCanReactivateDeactivatedUser()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRoles.Student);

            user.Should().NotBeNull();

            var userId = user!.Id;

            await _client.DeleteAsync($"/api/Users/{userId}");

            var deactivatedUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);
            deactivatedUser!.IsActive.Should().BeFalse();

            var response = await _client.PostAsJsonAsync($"/api/Users/{userId}/reactivate", new { });

            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var reactivatedUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            reactivatedUser.Should().NotBeNull();
            reactivatedUser!.IsActive.Should().BeTrue();
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-09: Get user by ID
    [Fact]
    public async Task TC_UserMgmt_09_GetUserById_ShouldReturnUserDetails()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync();

            user.Should().NotBeNull();

            var userId = user!.Id;

            var response = await _client.GetAsync($"/api/Users/{userId}");

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var userDetails = await response.Content.ReadFromJsonAsync<UserDetailsDto>();

            userDetails.Should().NotBeNull();
            userDetails!.Id.Should().Be(userId);
            userDetails.Username.Should().Be(user.Username);
            userDetails.Email.Should().Be(user.Email);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-10: Get users with pagination
    [Fact]
    public async Task TC_UserMgmt_10_GetUsers_WithPaginationShouldReturnPagedResults()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.GetAsync("/api/Users?page=1&pageSize=5");

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await response.Content.ReadFromJsonAsync<PagedResult<UserDto>>();

            result.Should().NotBeNull();
            result!.Page.Should().Be(1);
            result.PageSize.Should().Be(5);
            result.Items.Should().HaveCountLessThanOrEqualTo(5);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-11: Filter users by role
    [Fact]
    public async Task TC_UserMgmt_11_GetUsers_FilterByRoleShouldReturnOnlyUsersWithSelectedRole()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.GetAsync("/api/Users?role=Professor");

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await response.Content.ReadFromJsonAsync<PagedResult<UserDto>>();

            result.Should().NotBeNull();
            result!.Items.Should().AllSatisfy(u => u.Role.Should().Be("Professor"));
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-12: Create user with duplicate username should fail
    [Fact]
    public async Task TC_UserMgmt_12_CreateUser_DuplicateUsernameShouldReturnBadRequest()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync();

            existingUser.Should().NotBeNull();

            var dto = new CreateUserDto
            {
                Username = existingUser!.Username,
                Email = "unique_" + Guid.NewGuid().ToString().Substring(0, 8) + "@test.com",
                FirstName = "Test",
                LastName = "User",
                Password = "TestPassword123!",
                BirthDate = new DateOnly(2000, 1, 1)
            };

            var response = await _client.PostAsJsonAsync("/api/Users", dto);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    // TC-UserMgmt-13: Get user with invalid ID should return not found
    [Fact]
    public async Task TC_UserMgmt_13_GetUser_InvalidUserIdShouldReturnNotFound()
    {
        _client.LoginAsAdmin();

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.GetAsync("/api/Users/99999");

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }
}
