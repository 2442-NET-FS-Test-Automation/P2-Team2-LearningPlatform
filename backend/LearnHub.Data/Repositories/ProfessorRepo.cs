

using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

public class ProfessorRepo: IProfessorRepo
{
    private readonly LearnHubDbContext _context;
    private readonly IUserRepo _userRepo;

    public ProfessorRepo( LearnHubDbContext context, IUserRepo userRepo)
    {
        _userRepo = userRepo;
        _context = context;
    }

    public async Task<Professor?> CreateAsync(Professor professor)
    {
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();
        return professor;
    }
}