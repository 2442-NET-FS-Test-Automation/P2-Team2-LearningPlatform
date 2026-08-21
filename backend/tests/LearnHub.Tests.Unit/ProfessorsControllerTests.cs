using System.Security.Claims;
using LearnHub.Api.Controllers;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Api.DTOs.Users;
using LearnHub.Api.DTOs;
using LearnHub.Data.Entities;
using LearnHub.Data;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace LearnHub.Tests.Unit;

public class ProfessorsControllerTests
{
    private readonly Mock<IUserRepo> _userRepoMock;
    private readonly Mock<IProfessorRepo> _professorRepoMock;
    private readonly Mock<ICourseRepo> _courseRepoMock;
    private readonly ProfessorsController _sut;

    public ProfessorsControllerTests()
    {
        _userRepoMock = new Mock<IUserRepo>();
        _professorRepoMock = new Mock<IProfessorRepo>();
        _courseRepoMock = new Mock<ICourseRepo>();

        _sut = new ProfessorsController(
            _userRepoMock.Object,
            _professorRepoMock.Object,
            _courseRepoMock.Object);
    }

    private void SetUserContext(string? username, bool isAuthenticated, string? role)
    {
        var claims = new List<Claim>();
        if (username is not null) claims.Add(new Claim(ClaimTypes.Name, username));
        if (role is not null) claims.Add(new Claim(ClaimTypes.Role, role));

        var identity = new ClaimsIdentity(claims, isAuthenticated ? "TestAuth" : null);
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        var controllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        _sut.ControllerContext = controllerContext;
    }

    [Fact]
    public async Task GetProfessorCourses_ValidProfessor_ReturnsCourses()
    {
        // Arrange
        SetUserContext("prof1", isAuthenticated: true, role: "Professor");

        var user = new User { Id = 1, Username = "prof1" };
        _userRepoMock.Setup(r => r.GetByEmailOrUsernameAsync("prof1")).ReturnsAsync(user);

        var professor = new Professor 
        { 
            Id = 1, 
            UserId = 1, 
            Courses = new List<Course> 
            { 
                new Course { Id = 10, Name = "Prof Course", CategoryName = CourseCategory.Programming, IsActive = true, EnrollmentPrice = 50, Capacity = 20 }
            }
        };
        _professorRepoMock.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(professor);
        _courseRepoMock.Setup(r => r.GetCourseScheduleById(10)).ReturnsAsync(new List<CourseSchedule>());

        // Act
        var result = await _sut.GetProfessorCourses();

        // Assert
        var actionResult = Assert.IsType<ActionResult<List<CourseDetailDto>>>(result);
        var courses = actionResult.Value;
        Assert.NotNull(courses);
        Assert.Single(courses);
        Assert.Equal(10, courses[0].Id);
        Assert.Equal("Prof Course", courses[0].Name);
    }

    [Fact]
    public async Task GetProfessorShift_ValidProfessor_ReturnsShift()
    {
        // Arrange
        SetUserContext("prof1", isAuthenticated: true, role: "Professor");

        var user = new User { Id = 1, Username = "prof1" };
        _userRepoMock.Setup(r => r.GetByEmailOrUsernameAsync("prof1")).ReturnsAsync(user);

        var shift = new Shift { Id = 1, Name = "Morning", StartTime = new TimeOnly(8, 0, 0), EndTime = new TimeOnly(12, 0, 0) };
        _professorRepoMock.Setup(r => r.GetShiftByIdAsync(1)).ReturnsAsync(shift);

        // Act
        var result = await _sut.GetProfessorShift();

        // Assert
        var actionResult = Assert.IsType<ActionResult<ReturnShiftDto>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedShift = Assert.IsType<ReturnShiftDto>(okResult.Value);
        Assert.Equal(1, returnedShift.Id);
        Assert.Equal("Morning", returnedShift.Name);
    }

    [Fact]
    public async Task GetProfessorSummary_ValidProfessor_ReturnsSummary()
    {
        // Arrange
        SetUserContext("prof1", isAuthenticated: true, role: "Professor");

        var user = new User { Id = 1, Username = "prof1" };
        _userRepoMock.Setup(r => r.GetByEmailOrUsernameAsync("prof1")).ReturnsAsync(user);

        var professor = new Professor { Id = 1, UserId = 1 };
        _professorRepoMock.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(professor);

        var summary = new ProfessorSummaryResult
        {
            TotalCourses = 5,
            TotalStudents = 100,
            TotalActivities = 20,
            PendingSubmissionsToGrade = 10,
            TopCourses = new List<TopCourseItem> 
            {
                new TopCourseItem { CourseId = 1, Name = "Top Course", Category = "IT", EnrolledStudentsCount = 50 }
            }
        };
        _professorRepoMock.Setup(r => r.GetProfessorSummaryAsync(1)).ReturnsAsync(summary);

        // Act
        var result = await _sut.GetProfessorSummary();

        // Assert
        var actionResult = Assert.IsType<ActionResult<ProfessorSummaryDto>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedSummary = Assert.IsType<ProfessorSummaryDto>(okResult.Value);
        
        Assert.Equal(5, returnedSummary.TotalCourses);
        Assert.Equal(10, returnedSummary.PendingSubmissionsToGrade);
        Assert.Single(returnedSummary.TopCourses);
        Assert.Equal("Top Course", returnedSummary.TopCourses[0].Name);
    }
}
