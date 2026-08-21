using System.Security.Claims;
using AutoMapper;
using LearnHub.Api.Controllers;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Api.DTOs;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace LearnHub.Tests.Unit;

public class ActivitiesControllerProfessorTests
{
    private readonly Mock<IActivityRepo> _activityRepoMock;
    private readonly Mock<IUserRepo> _userRepoMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<INotificationsRepo> _notificationsRepoMock;
    private readonly Mock<ICourseRepo> _courseRepoMock;
    private readonly ActivitiesController _sut;

    public ActivitiesControllerProfessorTests()
    {
        _activityRepoMock = new Mock<IActivityRepo>();
        _userRepoMock = new Mock<IUserRepo>();
        _mapperMock = new Mock<IMapper>();
        _notificationsRepoMock = new Mock<INotificationsRepo>();
        _courseRepoMock = new Mock<ICourseRepo>();

        _sut = new ActivitiesController(
            _activityRepoMock.Object,
            _mapperMock.Object,
            _userRepoMock.Object,
            _notificationsRepoMock.Object,
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
    public async Task Create_ValidData_ReturnsCreated()
    {
        // Arrange
        SetUserContext("prof1", true, "Professor");

        var dto = new CreateActivityDto 
        { 
            CourseId = 1, 
            Title = "Test Activity", 
            Description = "Desc", 
            DueDate = DateTime.UtcNow.AddDays(1) 
        };

        _activityRepoMock.Setup(r => r.CourseExistsAsync(1)).ReturnsAsync(true);
        _activityRepoMock.Setup(r => r.ProfessorTeachesCourseAsync("prof1", 1)).ReturnsAsync(true);

        var user = new User { Id = 1, Username = "prof1" };
        _userRepoMock.Setup(r => r.GetByEmailOrUsernameAsync("prof1")).ReturnsAsync(user);

        var activity = new Activity { Id = 10 };
        _activityRepoMock.Setup(r => r.CreateAsync(It.IsAny<Activity>())).ReturnsAsync(activity);

        _courseRepoMock.Setup(r => r.GetEnrolledUserIdsAsync(1)).ReturnsAsync(new List<int> { 2, 3 });

        _mapperMock.Setup(m => m.Map<ActivitySummaryDto>(It.IsAny<Activity>()))
                   .Returns(new ActivitySummaryDto { Id = 10, Title = "Test Activity" });

        // Act
        var result = await _sut.Create(dto);

        // Assert
        var actionResult = Assert.IsType<ActionResult<ActivitySummaryDto>>(result);
        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var returnedDto = Assert.IsType<ActivitySummaryDto>(createdResult.Value);
        Assert.Equal(10, returnedDto.Id);
        
        _activityRepoMock.Verify(r => r.CreateAsync(It.IsAny<Activity>()), Times.Once);
        _notificationsRepoMock.Verify(r => r.AddNotificationsAsync(It.IsAny<IEnumerable<Notification>>()), Times.Once);
    }

    [Fact]
    public async Task Create_PastDueDate_ReturnsBadRequest()
    {
        // Arrange
        SetUserContext("prof1", true, "Professor");

        var dto = new CreateActivityDto 
        { 
            CourseId = 1, 
            Title = "Test Activity", 
            Description = "Desc", 
            DueDate = DateTime.UtcNow.AddDays(-1) // Past date
        };

        // Act
        var result = await _sut.Create(dto);

        // Assert
        var actionResult = Assert.IsType<ActionResult<ActivitySummaryDto>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        
        // Assert that Create was never called
        _activityRepoMock.Verify(r => r.CreateAsync(It.IsAny<Activity>()), Times.Never);
    }

    [Fact]
    public async Task Delete_ProfessorTeachesCourse_ReturnsNoContent()
    {
        // Arrange
        SetUserContext("prof1", true, "Professor");
        
        var activity = new Activity { Id = 1, CourseId = 10 };
        _activityRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(activity);
        _activityRepoMock.Setup(r => r.ProfessorTeachesCourseAsync("prof1", 10)).ReturnsAsync(true);
        _activityRepoMock.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        // Act
        var result = await _sut.Delete(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
        _activityRepoMock.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task Reactivate_ProfessorTeachesCourse_ReturnsNoContent()
    {
        // Arrange
        SetUserContext("prof1", true, "Professor");
        
        var activity = new Activity { Id = 1, CourseId = 10 };
        _activityRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(activity);
        _activityRepoMock.Setup(r => r.ProfessorTeachesCourseAsync("prof1", 10)).ReturnsAsync(true);
        _activityRepoMock.Setup(r => r.ReactivateAsync(1)).ReturnsAsync(true);

        // Act
        var result = await _sut.Reactivate(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
        _activityRepoMock.Verify(r => r.ReactivateAsync(1), Times.Once);
    }

    [Fact]
    public async Task Delete_ProfessorDoesNotTeachCourse_ReturnsForbid()
    {
        // Arrange
        SetUserContext("prof2", true, "Professor");
        
        var activity = new Activity { Id = 1, CourseId = 10 };
        _activityRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(activity);
        _activityRepoMock.Setup(r => r.ProfessorTeachesCourseAsync("prof2", 10)).ReturnsAsync(false); // Does not teach

        // Act
        var result = await _sut.Delete(1);

        // Assert
        Assert.IsType<ForbidResult>(result);
        _activityRepoMock.Verify(r => r.DeleteAsync(1), Times.Never);
    }
}
