using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface ICourseRepo
{
    Task<PagedResult<Course>> GetAllAsync(int page, int pageSize);
    Task<PagedResult<Course>> GetEnabledAsync(int page, int pageSize);
    Task<PagedResult<Course>> GetDisabledAsync(int page, int pageSize);

    Task<Course?> GetByIdAsync(int id);

    Task<List<CourseSchedule>> GetCourseScheduleById(int id);

    Task<Course> CreateAsync(Course course);

    Task UpdateAsync(Course course);

    Task DeleteAsync(Course course);

    Task<bool> ProfessorExistsAsync(int id);
    Task<int> GetEnrollmentCountAsync(int courseId);
}