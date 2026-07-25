using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IShiftsRepo
{
    Task<List<Shift>> GetShiftsAsync();
}
