using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IShiftsRepo
{
    Task<PagedResult<Shift>> GetShiftsAsync(int page = 1, int pageSize = 10, string? search = null);
    Task<Shift?> GetById(int id);
    Task<Shift?> AddAsync(Shift shift);
    Task<bool> UpdateAsync(Shift shift);
}
