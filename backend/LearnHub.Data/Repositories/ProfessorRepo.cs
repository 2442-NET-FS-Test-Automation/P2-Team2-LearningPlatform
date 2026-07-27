

using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ProfessorRepo: IProfessorRepo
{
    private readonly LearnHubDbContext _context;
    private readonly IUserRepo _userRepo;

    public ProfessorRepo( LearnHubDbContext context, IUserRepo userRepo)
    {
        _userRepo = userRepo;
        _context = context;
    }

    public void Add(Professor professor)
    {
        _context.Professors.Add(professor);
    }

    public async Task<Professor?> GetByIdAsync(int id)
    {
        return await _context.Professors
            .Include(p => p.User)
            .Include(p => p.Shift)
            .Include(p => p.Courses)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Professor?> GetByUserIdAsync(int id) => 
        await _context.Professors
            .Include(p => p.Courses)
                .ThenInclude(c => c.Schedule)
            .FirstOrDefaultAsync(p => p.UserId == id);

    public async Task<User> AddAsync(Professor professor)
    {
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();
        return professor.User;
    }
    
    public async Task<bool> ExistsByUserIdAsync(int userId)
    {
        return await _context.Professors
            .AnyAsync(p => p.UserId == userId);
    }
}