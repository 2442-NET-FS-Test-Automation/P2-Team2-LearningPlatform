using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IShiftsRepo
{
    Task<PagedResult<Shift>> GetShiftsAsync(int page = 1, int pageSize = 10);
}
