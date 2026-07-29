using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class ProfessorRepo: IProfessorRepo
{
    private readonly LearnHubDbContext _context;
    private readonly IUserRepo _userRepo;

    public ProfessorRepo( LearnHubDbContext context, IUserRepo userRepo)
    {
        _userRepo = userRepo;
        _context = context;
    }

    public void Add(Professor professor)
    {
        _context.Professors.Add(professor);
    }

    public async Task<Professor?> GetByIdAsync(int id)
    {
        return await _context.Professors
            .Include(p => p.User)
            .Include(p => p.Shift)
            .Include(p => p.Courses)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Professor?> GetByUserIdAsync(int id) => 
        await _context.Professors
            .Include(p => p.Courses)
                .ThenInclude(c => c.Schedule)
            .FirstOrDefaultAsync(p => p.UserId == id);

    public async Task<User> AddAsync(Professor professor)
    {
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();
        return professor.User;
    }
    
    public async Task<bool> ExistsByUserIdAsync(int userId)
    {
        return await _context.Professors
            .AnyAsync(p => p.UserId == userId);
    }
    public async Task<Shift?> GetShiftByIdAsync(int userId)
    {
        var professor = await _context.Professors.FirstOrDefaultAsync(p => p.UserId == userId);
        if (professor == null) return null;

        return await _context.Shifts.FirstOrDefaultAsync(s => s.Id == professor.ShiftId);
    }

    public async Task<ProfessorSummaryResult> GetProfessorSummaryAsync(int userId)
    {
        var professor = await _context.Professors
            .Include(p => p.Courses)
            .FirstOrDefaultAsync(p => p.UserId == userId);
            
        if (professor == null) return new ProfessorSummaryResult();

        var courseIds = professor.Courses.Select(c => c.Id).ToList();

        var totalCourses = courseIds.Count;

        var totalStudents = await _context.StudentCourses
            .Where(sc => courseIds.Contains(sc.CourseId))
            .Select(sc => sc.StudentId)
            .Distinct()
            .CountAsync();

        var totalActivities = await _context.Activities
            .Where(a => courseIds.Contains(a.CourseId) && a.IsActive)
            .CountAsync();

        var pendingSubmissions = await _context.ActivitySubmissions
            .Include(s => s.Activity)
            .Where(s => courseIds.Contains(s.Activity.CourseId) && s.Score == null)
            .CountAsync();

        var topCourses = await _context.Courses
            .Where(c => courseIds.Contains(c.Id))
            .Select(c => new TopCourseItem
            {
                CourseId = c.Id,
                Name = c.Name,
                Category = c.CategoryName.ToString(),
                EnrolledStudentsCount = c.StudentCourses.Count()
            })
            .OrderByDescending(c => c.EnrolledStudentsCount)
            .Take(5)
            .ToListAsync();

        return new ProfessorSummaryResult
        {
            TotalCourses = totalCourses,
            TotalStudents = totalStudents,
            TotalActivities = totalActivities,
            PendingSubmissionsToGrade = pendingSubmissions,
            TopCourses = topCourses
        };
    }
}