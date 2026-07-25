

using LearnHub.Data.Entities;

public interface IProfessorRepo
{
    void Add(Professor professor);
    Task<Professor?> GetByIdAsync(int id);
    Task<bool> ExistsByUserIdAsync(int userId);
}