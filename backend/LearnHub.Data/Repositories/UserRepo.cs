using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace LearnHub.Data.Repositories;


public class UserRepo : IUserRepo
{
    private readonly LearnHubDbContext _context;


    public UserRepo(LearnHubDbContext context, IPasswordHasher<User> hasher)
    {
        _context = context;
    }


    public async Task<bool> EmailExistsAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if(user is not null)
            return true;

        return false;
    }


    public async Task<bool> UsernameExistsAsync(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if(user is not null)
            return true;

        return false;
    }

    public async Task<User> RegisterStudentAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student.User;
    }

}