using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class ActivityRepo : IActivityRepo
{
    private readonly LearnHubDbContext _context;
    public ActivityRepo(LearnHubDbContext context) => _context = context;

    public async Task<PagedResult<Activity>> GetAllAsync(int page, int pageSize, int? courseId)
    {
        var query = _context.Activities
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .Include(a => a.Submissions)
            .AsQueryable();

        if (courseId.HasValue)
            query = query.Where(a => a.CourseId == courseId.Value);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Activity>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<PagedResult<Activity>> GetByCourseAsync(int courseId, bool? isActive,int page, int pageSize)
    {
        var query = _context.Activities
            .Where(a => a.CourseId == courseId)
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .Include(a => a.Submissions)
            .AsQueryable();

        if(isActive.HasValue)
            query = query.Where(a => a.IsActive == isActive);


        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Activity>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<Activity?> GetByIdAsync(int activityId) =>
        await _context.Activities
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .Include(a => a.Submissions)
                .ThenInclude(s => s.Student)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.Id == activityId);

    public async Task<bool> ProfessorTeachesCourseAsync(string username, int courseId) =>
        await _context.Courses
            .AnyAsync(c => c.Id == courseId && 
                    c.Professor != null && 
                    c.Professor.User.Username == username);
    public async Task<bool> StudentEnrolledInCourseAsync(string username, int courseId) =>
        await _context.StudentCourses
            .AnyAsync(sc => sc.CourseId == courseId && sc.Student.User.Username == username);

    public async Task<int> GetStudentIdByUsernameAsync(string username)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.User.Username == username);
        return student!.Id;
    }

    public async Task<Activity> CreateAsync(Activity activity)
    {
        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();
        return activity;
    }

    public async Task<bool> DeleteAsync(int activityId)
    {
        var activity = await _context.Activities.FindAsync(activityId);
        if (activity is null) return false;

        activity.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReactivateAsync(int activityId)
    {
        var activity = await _context.Activities.FindAsync(activityId);
        if (activity is null) return false;

        activity.IsActive = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ActivitySubmission?> GetSubmissionAsync(int activityId, int studentId) =>
        await _context.ActivitySubmissions
            .FirstOrDefaultAsync(s => s.ActivityId == activityId && s.StudentId == studentId);

    public async Task<ActivitySubmission> CreateSubmissionAsync(ActivitySubmission submission)
    {
        _context.ActivitySubmissions.Add(submission);
        await _context.SaveChangesAsync();
        return submission;
    }

    public async Task<bool> GradeSubmissionAsync(int submissionId, string feedback, decimal score)
    {
        var submission = await _context.ActivitySubmissions.FindAsync(submissionId);
        if (submission is null) return false;

        submission.Feedback = feedback;
        submission.Score = score;
        submission.GradedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CourseExistsAsync(int courseId) => await _context.Courses.AnyAsync(c => c.Id == courseId);

    // example implementation
    public async Task<Activity?> GetByIdWithSubmissionsAsync(int id) =>
        await _context.Activities
            .Include(a => a.Submissions)
                .ThenInclude(s => s.Student)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<PagedResult<Activity>> GetByCourseWithStudentSubmissionAsync(
        int courseId, int studentId, int page, int pageSize)
    {
        var query = _context.Activities
            .Where(a => a.CourseId == courseId && a.IsActive)
            .Include(a => a.Submissions.Where(s => s.StudentId == studentId));

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(a => a.DueDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Activity> { Items = items, Page = page, PageSize = pageSize, TotalItems = total, TotalPages = (int)Math.Ceiling(total / (double)pageSize) };
    }
}