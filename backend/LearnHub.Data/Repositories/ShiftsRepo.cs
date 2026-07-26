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

    public async Task<PagedResult<Shift>> GetShiftsAsync(int page = 1, int pageSize = 10, string? search = null)
    {
        var query = _context.Shifts.AsQueryable();

        if (search != null) query = query.Where(s => s.Name.ToLower().Contains(search.ToLower()));

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
        if (await _context.Shifts.AnyAsync(s => s.Name == shift.Name)) return null;
        _context.Shifts.Add(shift);
        await _context.SaveChangesAsync();
        return shift;
    }
    public async Task<bool> UpdateAsync(Shift shift)
    {
        if (await _context.Shifts.AnyAsync(s => s.Name == shift.Name)) return false;
        _context.Shifts.Update(shift);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Shift?> GetById(int id)
    {
        return await _context.Shifts.FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<bool> RemoveById(int id)
    {
        var shift = await GetById(id);
        if (shift == null) return false;

        _context.Shifts.Remove(shift);
        await _context.SaveChangesAsync();
        return true;
    }
}
