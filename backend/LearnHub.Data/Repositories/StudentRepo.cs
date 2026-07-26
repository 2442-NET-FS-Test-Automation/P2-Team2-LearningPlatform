using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class StudentRepo(LearnHubDbContext context): IStudentRepo
{
    private readonly LearnHubDbContext _context = context;

    public void Add(Student student)
    {
        _context.Students.Add(student);
    }

    public async Task<Student?> GetByIdAsync(int id)
    {
        return await _context.Students
            .Include(s => s.User)
            .Include(s => s.StudentCourses)
                .ThenInclude(sc => sc.Course)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Student?> GetByUserIdAsync(int userId)
    {
        return await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task<User> AddAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student.User;
    }

    public async Task<bool> EnrollAsync(int studentId, int courseId)
    {
        try {
            var enrollment = new StudentCourse{ StudentId = studentId, CourseId = courseId };

            await _context.StudentCourses.AddAsync(enrollment);
            await _context.SaveChangesAsync();
            return true;
        } 
        catch
        {
            return false;
        }
    }

    public async Task<StudentCourse?> GetStudentCourseByIds(int studentId, int courseId)
    {
        return await _context.StudentCourses.Include(sc => sc.Course).FirstOrDefaultAsync(sc => sc.StudentId == studentId && sc.CourseId == courseId);
    }
}