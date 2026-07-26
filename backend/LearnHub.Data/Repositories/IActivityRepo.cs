using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IActivityRepo
{
    // Queries
    Task<List<Activity>> GetByCourseAsync(int courseId);
    Task<List<Activity>> GetAllAsync();                          // admin
    Task<Activity?> GetByIdAsync(int activityId);

    // Commands
    Task<Activity> CreateAsync(Activity activity);
    Task<bool> DeleteAsync(int activityId);

    // Submissions
    Task<ActivitySubmission?> GetSubmissionAsync(int activityId, int studentId);
    Task<ActivitySubmission> CreateSubmissionAsync(ActivitySubmission submission);
    Task<bool> GradeSubmissionAsync(int submissionId, string feedback, decimal score);
}