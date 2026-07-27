using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IActivityRepo
{
    // Queries
    Task<PagedResult<Activity>> GetByCourseAsync(int courseId, int page, int pageSize);
    Task<PagedResult<Activity>> GetAllAsync(int page, int pageSize, int? courseId);
    Task<Activity?> GetByIdAsync(int activityId);

    Task<bool> ProfessorTeachesCourseAsync(string username, int courseId);
    Task<bool> StudentEnrolledInCourseAsync(string username, int courseId);
    Task<int> GetStudentIdByUsernameAsync(string username);

    Task<Activity> CreateAsync(Activity activity);
    Task<bool> DeleteAsync(int activityId);

    Task<ActivitySubmission?> GetSubmissionAsync(int activityId, int studentId);
    Task<ActivitySubmission> CreateSubmissionAsync(ActivitySubmission submission);
    Task<bool> GradeSubmissionAsync(int submissionId, string feedback, decimal score);
    Task<bool> CourseExistsAsync(int courseId);
    Task<PagedResult<Activity>> GetByCourseWithStudentSubmissionAsync(int courseId, int studentId, int page, int pageSize);
    Task<Activity?> GetByIdWithSubmissionsAsync(int id);
}