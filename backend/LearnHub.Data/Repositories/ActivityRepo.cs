using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class ActivityRepo : IActivityRepo
{
    private readonly LearnHubDbContext _context;
    public ActivityRepo(LearnHubDbContext context) => _context = context;

    public async Task<List<Activity>> GetByCourseAsync(int courseId) =>
        await _context.Activities
            .Where(a => a.CourseId == courseId && a.IsActive)
            .Include(a => a.CreatedBy)
            .Include(a => a.Submissions)
            .ToListAsync();

    public async Task<List<Activity>> GetAllAsync() =>
        await _context.Activities
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .Include(a => a.Submissions)
            .ToListAsync();

    public async Task<Activity?> GetByIdAsync(int activityId) =>
        await _context.Activities
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .Include(a => a.Submissions)
                .ThenInclude(s => s.Student)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.Id == activityId);

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
}