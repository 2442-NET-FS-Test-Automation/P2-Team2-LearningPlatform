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


public class CourseControllerTests : IClassFixture<TestApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly LearnHubDbContext _context;
    private IDbContextTransaction? _transaction;

    public CourseControllerTests(TestApplicationFactory factory)
    {
        _client = factory.CreateClient();

        var scope = factory.Services.CreateScope();
        _context = scope.ServiceProvider
            .GetRequiredService<LearnHubDbContext>();
    }

    [Fact]
    public async Task TC_CM_12_CreateCourse_ShouldCreateCourseSuccessfully()
    {
        _client.LoginAsAdmin();

        var dto = new CreateCourseDto
        {
            ProfessorId = 1,
            Name = "Algorithms",
            Description = "Introduction to algorithms",
            About = "Learn sorting, searching and graph algorithms.",
            Category = CourseCategory.Programming,
            Capacity = 30,
            Certification = true,
            Hours = 40,
            Price = 499.99m,
            Schedule =
            [
                new CourseScheduleDto
                {
                    Day = DayOfWeek.Monday,
                    StartTime = new TimeOnly(9, 0),
                    EndTime = new TimeOnly(11, 0)
                }
            ]
        };

        _transaction = await _context.Database.BeginTransactionAsync();
        HttpResponseMessage response;
        try
        {
            response = await _client.PostAsJsonAsync(
                "/api/Courses",
                dto
            );

            response.StatusCode.Should().Be(HttpStatusCode.Created);
        
            response.Headers.Location.Should().NotBeNull();

            var getResponse = await _client.GetAsync(response.Headers.Location);

            getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var course = await getResponse.Content.ReadFromJsonAsync<CourseDetailDto>();
            
            course.Should().NotBeNull();

            course!.Name.Should().Be(dto.Name);

            course.Description.Should().Be(dto.Description);

            course.Capacity.Should().Be(dto.Capacity);

            course.Price.Should().Be(dto.Price);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }   

    [Fact]
    public async Task TC_CM_13_UpdateCourse_ShouldUpdateCourseSuccesfully()
    {
        _client.LoginAsAdmin();

        var courseId = 1;

        var dto = new UpdateCourseDto
        {
            Name = "Advanced Algorithms",
            Description = "Updated description",
            About = "Updated about",
            Capacity = 50,
            Certification = true,
            Hours = 60,
            Price = 599.99m
        };

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.PatchAsJsonAsync(
                $"/api/Courses/{courseId}",
                dto
            );

            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var getResponse = await _client.GetAsync($"/api/Courses/{courseId}");

            getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var course = await getResponse.Content.ReadFromJsonAsync<CourseDetailDto>();

            course.Should().NotBeNull();

            course!.Name.Should().Be(dto.Name);
            course.Description.Should().Be(dto.Description);
            course.About.Should().Be(dto.About);
            course.Capacity.Should().Be(dto.Capacity);
            course.Certification.Should().Be(dto.Certification!.Value);
            course.Hours.Should().Be(dto.Hours);
            course.Price.Should().Be(dto.Price);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    [Fact]
    public async Task TC_CM_14_DeleteCourse_ShouldDeactivateCourseSuccesfully()
    {
        _client.LoginAsAdmin();

        var courseId = 1;

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.DeleteAsync($"/api/Courses/{courseId}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var enabledResponse = await _client.GetAsync("/api/Courses/enabled");
            var enabled = await enabledResponse.Content.ReadFromJsonAsync<PagedResult<CourseListDto>>();

            enabled!.Items.Should().NotContain(c => c.Id == courseId);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    [Theory]
    [InlineData("AB", 400)]
    [InlineData("ABC",201)]
    [InlineData("...(100 chars)", 201)]
    [InlineData("...(101 chars)", 201)]
    public async Task TC_CM_15_CreateCourse_NameValidation(string name, int expectedStatus)
    {
        _client.LoginAsAdmin();

        var dto = new CreateCourseDto
        {
            ProfessorId = 1,
            Name = name,
            Description = "Valid description here",
            About = "Valid about section here",
            Category = CourseCategory.Programming,
            Capacity = 30,
            Certification = false,
            Hours = 40,
            Price = 100m
        };

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.PostAsJsonAsync("/api/Courses", dto);
            ((int)response.StatusCode).Should().Be(expectedStatus);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }


    [Fact]
    public async Task TC_CM_15e_CreateCourse_InvalidProfessor_ShouldReturnBadRequest()
    {
        _client.LoginAsAdmin();

        var dto = new CreateCourseDto
        {
            ProfessorId = 9999999,
            Name = "Valid Course",
            Description = "Valid description here",
            About = "Valid about section here",
            Category = CourseCategory.Programming,
            Capacity = 30,
            Certification = false,
            Hours = 40,
            Price = 100m
        };

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var response = await _client.PostAsJsonAsync("/api/Courses", dto);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    [Fact]
    public async Task TC_CM_16_GetCourse_ShouldReturnLatestPersistedInformation()
    {
        _client.LoginAsAdmin();

        var courseId = 1;

        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var updateDto = new UpdateCourseDto
            {
                Name = "Updated Course Name",
                Description = "Updated description for the course",
                About = "Updated about section",
                Capacity = 45,
                Certification = true,
                Hours = 55,
                Price = 699.99m
            };

            var patchResponse = await _client.PatchAsJsonAsync($"/api/Courses/{courseId}", updateDto);

            patchResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);


            var getResponse = await _client.GetAsync($"/api/Courses/{courseId}");
            getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var course = await getResponse.Content.ReadFromJsonAsync<CourseDetailDto>();

            course.Should().NotBeNull();
            course!.Name.Should().Be(updateDto.Name);
            course.Description.Should().Be(updateDto.Description);
            course.About.Should().Be(updateDto.About);
            course.Capacity.Should().Be(updateDto.Capacity!.Value);
            course.Certification.Should().Be(updateDto.Certification!.Value);
            course.Hours.Should().Be(updateDto.Hours);
            course.Price.Should().Be(updateDto.Price!.Value);
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }
}