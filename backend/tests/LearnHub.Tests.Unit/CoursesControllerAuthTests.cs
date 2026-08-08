using System.Security.Claims;
using LearnHub.Api.Controllers;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace LearnHub.Tests.Unit;

public class CoursesControllerAuthTests
{
    private readonly Mock<ICourseRepo> _courseRepoMock;
    private readonly Mock<IUserRepo> _userRepoMock;
    private readonly Mock<IStudentRepo> _studentRepoMock;
    private readonly IMemoryCache _cache;
    private readonly CoursesController _sut;

    public CoursesControllerAuthTests()
    {
        _courseRepoMock = new Mock<ICourseRepo>();
        _userRepoMock = new Mock<IUserRepo>();
        _studentRepoMock = new Mock<IStudentRepo>();
        _cache = new MemoryCache(new MemoryCacheOptions());

        // Build the controller (the only dependency required for the role-check logic)
        _sut = new CoursesController(
            _courseRepoMock.Object,
            _cache,
            _userRepoMock.Object,
            _studentRepoMock.Object);
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

    private static List<Course> GetSampleCourses() =>
        new()
        {
            new Course
            {
                Id = 1,
                Name = "Math 101",
                IsActive = true,
                CategoryName = CourseCategory.Mathematics,
                Capacity = 30,
                StudentCourses = new List<StudentCourse>
                {
                    new StudentCourse { StudentId = 1 }
                }
            },
            new Course
            {
                Id = 2,
                Name = "History 201",
                IsActive = true,
                CategoryName = CourseCategory.Languages,
                Capacity = 20,
                StudentCourses = new List<StudentCourse>()
            }
        };
    
    [Fact] // TC-AuthZ-01
    public async Task GetEnabledCourses_StudentRole_FetchesStudentAsync()
    {
        // Arrange
        var studentUser = new User { Id = 2, Username = "student1" };
        var student = new Student { Id = 1, UserId = 2 };
        var courses = GetSampleCourses();

        SetUserContext("student1", isAuthenticated: true, role: "Student");

        _userRepoMock
            .Setup(r => r.GetByEmailOrUsernameAsync("student1"))
            .ReturnsAsync(studentUser);

        _studentRepoMock
            .Setup(r => r.GetByUserIdAsync(2))
            .ReturnsAsync(student);

        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, true))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = courses,
                Page = 1,
                PageSize = 10,
                TotalItems = 2,
                TotalPages = 1
            });

        _courseRepoMock
            .Setup(r => r.GetCompletedCourseIdsForStudent(student.Id, It.IsAny<List<int>>()))
            .ReturnsAsync(new List<int> { 1 });

        // Act
        var result = await _sut.GetEnabledCourses(page: 1, pageSize: 10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PagedResult<CourseListDto>>(okResult.Value);
        var items = response.Items.ToList();

        // Call verifications
        _userRepoMock.Verify(r => r.GetByEmailOrUsernameAsync("student1"), Times.Once);
        _studentRepoMock.Verify(r => r.GetByUserIdAsync(2), Times.Once);
        _courseRepoMock.Verify(
            r => r.GetCompletedCourseIdsForStudent(student.Id, It.IsAny<List<int>>()),
            Times.Once);

        // Check for courses
        Assert.Equal(2, items.Count);

        // Course 1: enrolled and completed
        Assert.True(items[0].IsEnrolled);
        Assert.True(items[0].Completed);

        // Course 2: not enrolled, not completed
        Assert.False(items[1].IsEnrolled);
        Assert.False(items[1].Completed);
    }

    [Fact] // TC-AuthZ-01
    public async Task GetEnabledCourses_AdminRole_DoesNotFetchStudent()
    {
        // Arrange – Admin role
        SetUserContext("admin1", isAuthenticated: true, role: "Admin");

        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, true))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = GetSampleCourses(),
                Page = 1,
                PageSize = 10,
                TotalItems = 2,
                TotalPages = 1
            });

        // Act
        var result = await _sut.GetEnabledCourses(page: 1, pageSize: 10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PagedResult<CourseListDto>>(okResult.Value);
        var items = response.Items.ToList();

        // Flags default to false (no student-specific logic)
        Assert.False(items[0].IsEnrolled);
        Assert.False(items[0].Completed);
        Assert.False(items[1].IsEnrolled);
        Assert.False(items[1].Completed);

        // User / Student repos should NEVER be called for a non-Student role
        _userRepoMock.Verify(r => r.GetByEmailOrUsernameAsync(It.IsAny<string>()), Times.Never);
        _studentRepoMock.Verify(r => r.GetByUserIdAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact] // TC-AuthZ-01
    public async Task GetEnabledCourses_ProfessorRole_DoesNotFetchStudent()
    {
        // Arrange – Professor role
        SetUserContext("prof1", isAuthenticated: true, role: "Professor");

        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, true))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = GetSampleCourses(),
                Page = 1,
                PageSize = 10,
                TotalItems = 2,
                TotalPages = 1
            });

        // Act
        var result = await _sut.GetEnabledCourses(page: 1, pageSize: 10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PagedResult<CourseListDto>>(okResult.Value);
        var items = response.Items.ToList();

        Assert.False(items[0].IsEnrolled);
        Assert.False(items[0].Completed);
        Assert.False(items[1].IsEnrolled);
        Assert.False(items[1].Completed);

        _userRepoMock.Verify(r => r.GetByEmailOrUsernameAsync(It.IsAny<string>()), Times.Never);
        _studentRepoMock.Verify(r => r.GetByUserIdAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact] // TC-AuthZ-01
    public async Task GetEnabledCourses_Unauthenticated_DoesNotFetchStudent()
    {
        // Arrange – Unauthenticated (isAuthenticated = false)
        SetUserContext(null, isAuthenticated: false, role: null);

        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, true))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = GetSampleCourses(),
                Page = 1,
                PageSize = 10,
                TotalItems = 2,
                TotalPages = 1
            });

        // Act
        var result = await _sut.GetEnabledCourses(page: 1, pageSize: 10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<PagedResult<CourseListDto>>(okResult.Value);
        var items = response.Items.ToList();

        Assert.False(items[0].IsEnrolled);
        Assert.False(items[0].Completed);
        Assert.False(items[1].IsEnrolled);
        Assert.False(items[1].Completed);

        _userRepoMock.Verify(r => r.GetByEmailOrUsernameAsync(It.IsAny<string>()), Times.Never);
        _studentRepoMock.Verify(r => r.GetByUserIdAsync(It.IsAny<int>()), Times.Never);
    }
}