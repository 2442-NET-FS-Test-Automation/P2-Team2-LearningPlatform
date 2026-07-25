using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class UserRepo : IUserRepo
{

    private readonly LearnHubDbContext _context;

    public UserRepo(LearnHubDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<User>> GetAllAsync(int page, int pageSize, UserRoles? role, string? fullName = null)
    {
        IQueryable<User> query = _context.Users;

        if(role.HasValue)  query = query.Where(u => u.Role == role.Value);

        if (!string.IsNullOrWhiteSpace(fullName))
        {
            fullName = fullName.Trim();

            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(fullName.ToLower())
                || u.Username.ToLower().Contains(fullName.ToLower()));   
        }

        var totalItems = await query.CountAsync();
        
        var users = await query
            .OrderBy(o => o.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        return new PagedResult<User>
        {
            Items = users,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Student)
                .ThenInclude(s => s!.StudentCourses)
                    .ThenInclude(sc => sc.Course)

            .Include(u => u.Professor)
                .ThenInclude(p => p!.Courses)

            .Include(u => u.Professor)
                .ThenInclude(p => p!.Shift)

            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Users
            .AnyAsync(o => o.Id == id);
    }


    public void Add(User user)
    {
        _context.Users.Add(user);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email);
    }


    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await _context.Users
            .AnyAsync(u => u.Username == username);
    }

    
}