using LearnHub.Data.Dtos.Courses;
using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface ICourseRepo
{
    Task<PagedResult<CourseListDto>> GetAllAsync(
        int page,
        int pageSize,
        bool? active = null);

    Task<Course?> GetByIdAsync(int id);

    Task<CourseDetailDto?> GetByIdDetailedAsync(int id);

    Task<Course> CreateAsync(Course course);

    Task UpdateAsync(Course course);

    Task DeleteAsync(Course course);

    Task<bool> ProfessorExistsAsync(int id);
}