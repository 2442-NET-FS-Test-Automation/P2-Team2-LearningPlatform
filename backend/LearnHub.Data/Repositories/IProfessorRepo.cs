

using LearnHub.Data.Entities;

public interface IProfessorRepo
{
    Task<Professor?> CreateAsync(Professor professor);
}