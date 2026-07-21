using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace LearnHub.Api.Services;


public class UserService : IUserService
{
    private readonly LearnHubDbContext _db;
    private readonly IPasswordHasher<User> _hasher;

    public UserService(LearnHubDbContext db, IPasswordHasher<User> hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    // -- Regster user task --
    public async Task<string?> RegisterUserAsync(
        string username,
        string firstName,
        string lastName,
        string email,
        string bio,
        string birthDate,
        string password
    )
    {
        //validate if user exists
        //validate if email exists
        if (await _db.Users.AnyAsync(u => u.Email == email))
        {
            return "Email already registered";
        }

        
        if (await _db.Users.AnyAsync(u => u.Username == username))
        {
            return "Username already registered";
        }

        var user = new User
        {
            Username = username,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Bio = bio,
            Role = UserRoles.Student
        };

        var student = new Student {
            User = user,
            BirthDate = DateOnly.Parse(birthDate)
        };

        user.PasswordHash = _hasher.HashPassword(user, password);
        
        // _db.Users.Add(user);
        _db.Students.Add(student);
        await _db.SaveChangesAsync();
        return null;
    }


    public async Task<User?> LoginUserAsync(string emailOrUsername, string password)
    {
        //validate if user exists
        User? foundUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailOrUsername || u.Username == emailOrUsername);

        if(foundUser is null)
            return null;


        //verify password
        var result = _hasher.VerifyHashedPassword(foundUser, foundUser.PasswordHash, password);

        return result == PasswordVerificationResult.Success ? foundUser : null;
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
    }
}