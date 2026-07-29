using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LearnHub.Api.DTOs.Courses;
using LearnHub.Api.DTOs.Students;
using LearnHub.Data.Repositories;
using LearnHub.Data;

namespace LearnHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController(ICourseRepo courseRepo, IStudentRepo studentRepo, IUserRepo userRepo): ControllerBase
{
    private readonly ICourseRepo _courseRepo = courseRepo;
    private readonly IStudentRepo _studentRepo = studentRepo;
    private readonly IUserRepo _userRepo = userRepo;
    
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

        try
        {
            if (await _studentRepo.EnrollAsync(student.Id, courseId))
                return Ok();

            return Conflict(new { error = "Student is already enrolled." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpDelete("{userId:int}/Courses/{courseId:int}")]
    [Authorize]
    public async Task<ActionResult> UnenrollStudent(int userId, int courseId)
    {
        var student = await _studentRepo.GetByUserIdAsync(userId);
        if (student == null) return BadRequest(new { error = "User is not a student" });

        if (await _studentRepo.UnenrollAsync(student.Id, courseId))
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

    [HttpGet("{userId:int}/Courses")]
    public async Task<ActionResult<ICollection<CourseDetailDto>>> GetStudentCourses(
        int userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50
    )
    {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var student = await _studentRepo.GetByUserIdAsync(userId);
        if (student == null) return BadRequest(new { error = "User is not a student" });

        var result = await _courseRepo.GetCoursesOfStudentAsync(page, pageSize, student.Id);

        var response = new PagedResult<CourseDetailDto>
        {
            Items = result.Items.Select(c => new CourseDetailDto
            {
                Id = c.Id,
                Name = c.Name,
                Schedule = c.Schedule
                    .Select(s => new CourseScheduleDto
                    {
                        Day = s.Day,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime
                    })
                    .ToList(),
                Grade = c.StudentCourses.First(sc => sc.CourseId == c.Id).Grade,
                Completed = c.StudentCourses.First(sc => sc.CourseId == c.Id).EndDate != null
            }).ToList(),

            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        };
        return Ok(response);
    }

    [HttpPost("{userId:int}/Courses/{courseId:int}/complete")]
    [Authorize(Roles = "Student")]  
    public async Task<ActionResult> CompleteCourse(int userId, int courseId)
    {
        var student = await _studentRepo.GetByUserIdAsync(userId);
        if (student == null) return BadRequest(error: "User is not a student");
        
        var username = User.Identity?.Name;
        var user = await _userRepo.GetByIdAsync(student.UserId);
        if (user == null) return BadRequest(error: "User does not exist");
        if (username != user.Username) return Forbid();

        try
        {
            bool success = await _studentRepo.CompleteStudentCourse(student.Id, courseId);
            if (!success) return NotFound();
            return Ok();
        }
        catch (Exception e)
        {
            return Conflict(error: e.Message);
        }
    }
}