using LearnHub.Api.DTOs.Students;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController(IUserRepo userRepo, IStudentRepo studentRepo): ControllerBase
{
    private readonly IUserRepo _userRepo = userRepo;
    private readonly IStudentRepo _studentRepo = studentRepo;
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<StudentDetailDto>> GetStudent(int id)
    {
        var student = await _studentRepo.GetByIdAsync(id);
        if(student == null) return NotFound();

        var dto = new StudentDetailDto
        {
            Id = student.Id,
            UserId = student.UserId,
            Username = student.User.Username,
            FullName = $"{student.User.FirstName} {student.User.LastName}",
            Email = student.User.Email,
            Bio = student.User.Bio,
            BirthDate = student.BirthDate,

            Courses = student.StudentCourses.Select(sc => new StudentCourseDto
            {
                Id = sc.Id,
                CourseId = sc.CourseId,
                CourseName = sc.Course.Name,
                Grade = sc.Grade,
                EnrollmentDate = sc.EnrollmentDate,
                EndDate = sc.EndDate
            })
        };

        return Ok(dto);
    }

    [HttpPost("Enroll")]
    [Authorize]
    public async Task<ActionResult> EnrollStudent(
        [FromQuery] int userId,
        [FromQuery] int courseId
    )
    {
        var student = await _studentRepo.GetByUserIdAsync(userId);
        if (student == null) return BadRequest(new { error = "User is not a student" });

        if (await _studentRepo.EnrollAsync(student.Id, courseId))
        {
            return Ok();
        }
        return Conflict();      
    }

    [HttpGet("{userId:int}/Courses/{courseId:int}")]
    [Authorize]
    public async Task<ActionResult<StudentCourseDto>> GetStudentCourse(int userId, int courseId)
    {
        var student = await _studentRepo.GetByUserIdAsync(userId);
        if (student == null) return BadRequest(new { error = "User is not a student" });

        var studentCourse = await _studentRepo.GetStudentCourseByIds(student.Id, courseId);
        if (studentCourse == null) return NotFound();

        var res = new StudentCourseDto{
            Id = studentCourse.Id,
            CourseId = studentCourse.CourseId,
            CourseName = studentCourse.Course.Name,
            EndDate = studentCourse.EndDate,
            EnrollmentDate = studentCourse.EnrollmentDate,
            Grade = studentCourse.Grade
        };

        return Ok();
    }

    // [HttpGet("{id:int}/Courses")]
    // [Authorize]
    // public async Task<ActionResult<>> GetStudentCourses(int studentId)
}