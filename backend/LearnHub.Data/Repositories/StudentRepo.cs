using Microsoft.EntityFrameworkCore;

using LearnHub.Data.Entities;

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

        var exists = await _context.StudentCourses.AnyAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);
        if (exists) return false;

        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course == null)
            throw new KeyNotFoundException("Course not found.");

        var enrolled = await _context.StudentCourses
            .CountAsync(sc => sc.CourseId == courseId);

        if (enrolled >= course.Capacity)
            throw new InvalidOperationException("Course is full.");

        var enrollment = new StudentCourse{ StudentId = studentId, CourseId = courseId };

        await _context.StudentCourses.AddAsync(enrollment);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UnenrollAsync(int studentId, int courseId)
    {
        try
        {
            var enrollment = await _context.StudentCourses.FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);
            if (enrollment == null) return false;

            _context.StudentCourses.Remove(enrollment);
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

    public async Task<bool> CompleteStudentCourse(int studentId, int courseId)
    {
        var studentCourse = await _context.StudentCourses.FirstOrDefaultAsync(sc => sc.StudentId == studentId && sc.CourseId == courseId);
        if (studentCourse == null) return false;

        var courseActivities = _context.Activities.Where(ca => ca.CourseId == courseId).AsQueryable();

        var activitySubmissions = _context.ActivitySubmissions.Where(a => a.StudentId == studentId).AsQueryable();

        // Know if student has pending activities
        bool allHaveSubmissions = courseActivities.All(ca => 
            activitySubmissions.Any(s => s.ActivityId == ca.Id)
        );
        if (!allHaveSubmissions) throw new Exception("There are pending activities");

        var courseActivityIds = courseActivities.Select(ca => ca.Id);
        var courseSubmissions = activitySubmissions.Where(s => courseActivityIds.Contains(s.ActivityId));

        var allGraded = courseSubmissions.All(cs => cs.Score != null);
        if (!allGraded) throw new Exception("There are activities waiting to be graded");

        decimal averageGrade = courseSubmissions.Any() 
            ? courseSubmissions.Average(s => s.Score ?? 100)
            : 100;

        studentCourse.EndDate = DateOnly.FromDateTime(DateTime.Now);
        studentCourse.Grade = (int)averageGrade;

        _context.Update(studentCourse);
        await _context.SaveChangesAsync();
        return true;
    }
}