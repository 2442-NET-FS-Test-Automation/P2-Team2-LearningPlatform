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

    public async Task<PagedResult<Shift>> GetShiftsAsync(int page = 1, int pageSize = 10)
    {
        var query = _context.Shifts.AsQueryable();

        var totalItems = await query.CountAsync();

        var shifts = await query
            .OrderBy(s => s.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();


        return new PagedResult<Shift>
        {
            Items = shifts,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }
    public async Task<Shift?> AddAsync(Shift shift)
    {
        _context.Shifts.Add(shift);
        await _context.SaveChangesAsync();
        return shift;
    }
    public async Task UpdateAsync(Shift shift)
    {
        _context.Shifts.Update(shift);
        await _context.SaveChangesAsync();
    }
}
