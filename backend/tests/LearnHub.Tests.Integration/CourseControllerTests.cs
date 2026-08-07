using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Data;
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
}