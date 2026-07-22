using LearnHub.Data.Entities;

public interface IStudentRepo
{
    void Add(Student student);

    Task<Student?> GetByIdAsync(int id);
}