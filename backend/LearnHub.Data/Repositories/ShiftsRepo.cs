using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class ShiftsRepo : IShiftsRepo
{
    private readonly LearnHubDbContext _context;

    public ShiftsRepo(LearnHubDbContext context)
    {
        _context = context;
    }

    public async Task<List<Shift>> GetShiftsAsync()
    {
        return await _context.Shifts.ToListAsync();
    }
}
