using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IStudentRepo
{
    void Add(Student student);
    Task<Student?> GetByIdAsync(int id);
    Task<Student?> GetByUserIdAsync(int userId);
    Task<User> AddAsync(Student student);
    Task<bool> EnrollAsync(int studentId, int courseId);
    Task<bool> UnenrollAsync(int studentId, int courseId);
    Task<StudentCourse?> GetStudentCourseByIds(int studentId, int courseId);
}