using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface ICourseRepo
{
    Task<PagedResult<Course>> GetAllAsync(int page, int pageSize, string? search = null, CourseCategory? categoryFilter = null, bool? isActiveFilter = null);
    Task<PagedResult<Course>> GetCoursesOfStudentAsync(int page, int pageSize, int studentId);
    Task<Course?> GetByIdAsync(int id);

    Task<List<CourseSchedule>> GetCourseScheduleById(int id);

    Task<Course> CreateAsync(Course course);

    Task UpdateAsync(Course course);

    Task DeleteAsync(Course course);

    Task<bool> ProfessorExistsAsync(int id);

    Task<int> GetEnrollmentCountAsync(int courseId);


    // Nuevos

    Task AddStudentAsync(int studentId, int courseId);

    Task RemoveStudentAsync(int studentId, int courseId);

    Task AssignProfessorAsync(int courseId, int professorId);

    Task RemoveProfessorAsync(int courseId);
    Task<List<Course>> GetByProfessorAsync(int professorId);
}