using LearnHub.Api.Controllers;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace LearnHub.Tests.Unit;

public class CoursesControllerPaginationTests
{
    private readonly Mock<ICourseRepo> _courseRepoMock;
    private readonly Mock<IUserRepo> _userRepoMock;
    private readonly Mock<IStudentRepo> _studentRepoMock;
    private readonly IMemoryCache _cache;
    private readonly CoursesController _sut;

    public CoursesControllerPaginationTests()
    {
        _courseRepoMock = new Mock<ICourseRepo>();
        _userRepoMock = new Mock<IUserRepo>();
        _studentRepoMock = new Mock<IStudentRepo>();
        _cache = new MemoryCache(new MemoryCacheOptions());

        // Build the controller (the only dependency required for the check logic)
        _sut = new CoursesController(
            _courseRepoMock.Object,
            _cache,
            _userRepoMock.Object,
            _studentRepoMock.Object);
    }

    [Fact] // TC-CM-07
    public async Task GetCourses_PageZero_ClampsToOne()
    {
        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, null))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = new List<Course>(),
                Page = 1,
                PageSize = 10,
                TotalItems = 0,
                TotalPages = 0
            });

        await _sut.GetCourses(page: 0, pageSize: 10);

        // Assert – verify the clamped values (page=1, pageSize=10) were passed to the repo
        _courseRepoMock.Verify(
            r => r.GetAllAsync(1, 10, null, null, null),
            Times.Once);
    }

    [Fact] // TC-CM-07
    public async Task GetCourses_PageNegative_ClampsToOne()
    {
        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, null))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = new List<Course>(),
                Page = 1,
                PageSize = 10,
                TotalItems = 0,
                TotalPages = 0
            });

        await _sut.GetCourses(page: -1, pageSize: 10);

        // Assert – verify the clamped values (page=1, pageSize=10) were passed to the repo
        _courseRepoMock.Verify(
            r => r.GetAllAsync(1, 10, null, null, null),
            Times.Once);
    }

    [Fact] // TC-CM-07
    public async Task GetCourses_PageSizeZero_FallsBackToDefault()
    {
        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 10, null, null, null))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = new List<Course>(),
                Page = 1,
                PageSize = 10,
                TotalItems = 0,
                TotalPages = 0
            });

        await _sut.GetCourses(page: 1, pageSize: 0);

        // Assert – verify the clamped values (page=1, pageSize=10) were passed to the repo
        _courseRepoMock.Verify(
            r => r.GetAllAsync(1, 10, null, null, null),
            Times.Once);
    }

    [Fact] // TC-CM-07
    public async Task GetCourses_PageSizeFiftyOne_ClampsToFifty()
    {
        _courseRepoMock
            .Setup(r => r.GetAllAsync(1, 50, null, null, null))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = new List<Course>(),
                Page = 1,
                PageSize = 50,
                TotalItems = 0,
                TotalPages = 0
            });

        await _sut.GetCourses(page: 1, pageSize: 51);

        // Assert – verify the clamped values (page=1, pageSize=50) were passed to the repo
        _courseRepoMock.Verify(
            r => r.GetAllAsync(1, 50, null, null, null),
            Times.Once);
    }

    [Fact] // TC-CM-07
    public async Task GetCourses_ValidPageAndPageSize_PassThroughUnchanged()
    {
        const int validPage = 2;
        const int validPageSize = 25;

        _courseRepoMock
            .Setup(r => r.GetAllAsync(validPage, validPageSize, null, null, null))
            .ReturnsAsync(new PagedResult<Course>
            {
                Items = new List<Course>(),
                Page = validPage,
                PageSize = validPageSize,
                TotalItems = 0,
                TotalPages = 0
            });

        await _sut.GetCourses(page: validPage, pageSize: validPageSize);

        // Assert – verify the values were passed to the repo
        _courseRepoMock.Verify(
            r => r.GetAllAsync(validPage, validPageSize, null, null, null),
            Times.Once);
    }
}