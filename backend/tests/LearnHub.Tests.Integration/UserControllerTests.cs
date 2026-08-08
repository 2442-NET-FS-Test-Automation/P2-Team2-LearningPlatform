using System.Net;
using System.Net.Http.Json;
using System.Runtime.InteropServices;
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


    // TC-UserMgmt-06
    [Fact]
    public async Task UpdateUser_AssignProfessorToCourse_ShouldAssignProfessorSuccesfully()
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
}