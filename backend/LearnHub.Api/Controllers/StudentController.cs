

using LearnHub.Api.DTOs.Students;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/students")]
public class StudentController: ControllerBase
{
    private readonly IUserRepo _userRepo;
    private readonly IStudentRepo _studentRepo;

    public StudentController(IUserRepo userRepo, IStudentRepo studentRepo)
    {
        _userRepo = userRepo;
        _studentRepo = studentRepo;
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDetailDto>> GetStudent(int id)
    {
        var student = await _studentRepo.GetByIdAsync(id);

        if(student == null)
            return NotFound();


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
}