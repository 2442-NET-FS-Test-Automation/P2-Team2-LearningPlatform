using LearnHub.Api.Controllers;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace LearnHub.Tests.Unit;


public class EnrollToCourseTests {

    private readonly Mock<ICourseRepo> _courseRepoMock = new();
    private readonly Mock<IStudentRepo> _studentRepoMock = new();
    private readonly Mock<IUserRepo> _userRepoMock = new();
    private readonly StudentsController _sut;


    public EnrollToCourseTests() {
        _sut = new StudentsController(
            _courseRepoMock.Object,
            _studentRepoMock.Object,
            _userRepoMock.Object
        );
    }


    [Fact] // TC-Enroll-01
    public async Task EnrollStudent_ValidStudentAndCourse_ReturnsOk()
    {
        var student = new Student { Id = 11, UserId = 6 };
        _studentRepoMock
            .Setup(r => r.GetByUserIdAsync(6))
            .ReturnsAsync(student);

        _studentRepoMock
            .Setup(r => r.EnrollAsync(11, 21))
            .ReturnsAsync(true);

        var result = await _sut.EnrollStudent(userId: 6, courseId: 21);

        Assert.IsType<OkResult>(result);
        _studentRepoMock.Verify(r => r.EnrollAsync(11, 21), Times.Once);
    }


    [Fact] // Tc-Enroll-02
    public async Task EnrollStudent_UserIsNotStudent_ReturnsBadRequest()
    {
        _studentRepoMock
            .Setup(r => r.GetByUserIdAsync(5))
            .ReturnsAsync((Student?)null);

        var result = await _sut.EnrollStudent(userId: 6, courseId: 15);


        Assert.IsType<BadRequestObjectResult>(result);
        _studentRepoMock.Verify(
            r => r.EnrollAsync(It.IsAny<int>(), It.IsAny<int>()),
            Times.Never
        );
    }


    [Fact] // TC-Enroll-03
    public async Task EnrollStudent_AlreadyEnrolled_ReturnsConflict()
    {
        var student = new Student { Id = 11, UserId = 6 };

        _studentRepoMock
            .Setup(r => r.GetByUserIdAsync(6))
            .ReturnsAsync(student);

        _studentRepoMock
            .Setup(r => r.EnrollAsync(11, 21))
            .ReturnsAsync(false);

        var result = await _sut.EnrollStudent(userId: 6, courseId: 21);

        Assert.IsType<ConflictObjectResult>(result);
        _studentRepoMock.Verify(r => r.EnrollAsync(11, 21), Times.Once);
    }


    [Fact] // TC-Enroll-04
    public async Task EnrollStudent_CourseFull_ReturnsBadRequest()
    {
        var student = new Student { Id = 11, UserId = 6 };

        _studentRepoMock
            .Setup(r => r.GetByUserIdAsync(6))
            .ReturnsAsync(student);

        _studentRepoMock
            .Setup(r => r.EnrollAsync(11, 21))
            .ThrowsAsync(new InvalidOperationException("Course is full."));

        var result = await _sut.EnrollStudent(userId: 6, courseId: 21);

        Assert.IsType<BadRequestObjectResult>(result);
        _studentRepoMock.Verify(r => r.EnrollAsync(11, 21), Times.Once);
    }


    [Fact] // TC-Enroll-05
    public async Task EnrollStudent_CourseNotFound_ReturnsNotFound()
    {
        var student = new Student { Id = 11, UserId = 6 };

        _studentRepoMock
            .Setup(r => r.GetByUserIdAsync(6))
            .ReturnsAsync(student);

        _studentRepoMock
            .Setup(r => r.EnrollAsync(11, 7))
            .ThrowsAsync(new KeyNotFoundException("Course not found")); 

        var result = await _sut.EnrollStudent(userId: 6, courseId: 7);


        Assert.IsType<NotFoundObjectResult>(result);
        _studentRepoMock.Verify(r => r.EnrollAsync(11 ,7), Times.Once);
    }
    
}

