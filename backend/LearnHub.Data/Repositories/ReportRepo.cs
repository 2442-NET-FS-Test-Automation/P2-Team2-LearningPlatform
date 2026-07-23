using LearnHub.Data.Dtos.Reports;
using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class ReportRepo : IReportRepo
{
    private readonly LearnHubDbContext _context;

    public ReportRepo(LearnHubDbContext context)
    {
        _context = context;
    }

    public async Task<AdminReportDto> GetGeneralReportAsync()
    {
        var totalCourses = await _context.Courses.CountAsync();
        
        var totalStudents = await _context.Users
            .Where(u => u.Role == UserRoles.Student)
            .CountAsync();

        var totalEnrollments = await _context.StudentCourses.CountAsync();

        var topCourses = await _context.Courses
            .Select(c => new TopCourseDto
            {
                CourseId = c.Id,
                CourseName = c.Name,
                // Assuming Course has a StudentCourses collection property for EF navigation
                EnrollmentCount = _context.StudentCourses.Count(sc => sc.CourseId == c.Id)
            })
            .OrderByDescending(c => c.EnrollmentCount)
            .Take(5)
            .ToListAsync();

        return new AdminReportDto
        {
            TotalCourses = totalCourses,
            TotalStudents = totalStudents,
            TotalEnrollments = totalEnrollments,
            TopCourses = topCourses
        };
    }
}
