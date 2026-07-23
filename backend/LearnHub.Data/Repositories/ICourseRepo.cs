using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface ICourseRepo
{
    Task<PagedResult<Course>> GetAllAsync(
        int page,
        int pageSize,
        bool? active = null);

    Task<Course?> GetByIdAsync(int id);

    Task<Course> CreateAsync(Course course);

    Task UpdateAsync(Course course);

    Task DeleteAsync(Course course);

    Task<bool> ProfessorExistsAsync(int id);
    Task<int> GetEnrollmentCountAsync(int courseId);
}