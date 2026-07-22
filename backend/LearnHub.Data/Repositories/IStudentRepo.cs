using LearnHub.Data.Entities;

public interface IStudentRepo
{
    Task<Student?> CreateAsync(Student student);
}