using LearnHub.Data;
using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IUserRepo
{
    Task<PagedResult<User>> GetAllAsync(int page,int pageSize,UserRoles? role = null,string? fullName = null);    
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task UpdateAsync(User user);
    Task<bool> ExistsAsync(int id);
    void Add(User user);

    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
}