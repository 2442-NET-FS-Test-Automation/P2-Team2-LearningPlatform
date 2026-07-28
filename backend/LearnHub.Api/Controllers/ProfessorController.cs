using LearnHub.Api.Controllers;
using LearnHub.Api.DTOs;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProfessorsController: ControllerBase
{
    private readonly IUserRepo _userRepo;
    private readonly IProfessorRepo _professorRepo;
    private readonly ICourseRepo _courseRepo;

    public ProfessorsController(IUserRepo userRepo, IProfessorRepo professorRepo, ICourseRepo courseRepo)
    {
        _userRepo = userRepo;
        _professorRepo = professorRepo;
        _courseRepo = courseRepo;
    }

    [HttpGet("MyCourses")]
    [Authorize(Roles = "Professor,Admin")]
    public async Task<ActionResult<List<CourseDetailDto>>> GetProfessorCourses()
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var user = await _userRepo.GetByEmailOrUsernameAsync(username);
        if (user == null) return BadRequest(error: "User does not exist");

        if (username != user.Username) return Forbid();

        var professor = await _professorRepo.GetByUserIdAsync(user.Id);
        if (professor == null) return BadRequest(error: "User is not a professor");

        List<CourseDetailDto> response = [];
        foreach (var course in professor.Courses)
        {
            var schedule = await _courseRepo.GetCourseScheduleById(course.Id);
            response.Add(new CourseDetailDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Category = course.CategoryName.ToString(),
                Price = course.EnrollmentPrice,
                Capacity = course.Capacity,
                IsActive = course.IsActive,
                Certification = course.Certification,

                Instructor = "",
                EnrolledStudents = 0,
                Schedule = schedule
                    .Select(s => new CourseScheduleDto
                    {
                        Day = s.Day,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime
                    })
                    .ToList()
            });
        };
        return response;
    }

    [HttpGet("Shift")]
    public async Task<ActionResult<ReturnShiftDto>> GetProfessorShift()
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var user = await _userRepo.GetByEmailOrUsernameAsync(username);
        if (user == null) return BadRequest(error: "User does not exist");

        var shift = await _professorRepo.GetShiftByIdAsync(user.Id);
        if (shift == null) return NotFound();
        
        return Ok(new ReturnShiftDto {
            Id = shift.Id,
            Name = shift.Name,
            StartTime = shift.StartTime.ToString(),
            EndTime = shift.EndTime.ToString()
        });
    }
}