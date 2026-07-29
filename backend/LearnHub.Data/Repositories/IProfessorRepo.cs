

using LearnHub.Data.Entities;

public interface IProfessorRepo
{
    void Add(Professor professor);
    Task<Professor?> GetByIdAsync(int id);
    Task<Professor?> GetByUserIdAsync(int id);
    Task<bool> ExistsByUserIdAsync(int userId);
    Task<Shift?> GetShiftByIdAsync(int userId);
}