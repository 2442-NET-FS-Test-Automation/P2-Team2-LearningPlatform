using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace LearnHub.Api.Services;


public class UserService : IUserService
{
    private readonly LearnHubDbContext _db;
    private readonly IPasswordHasher<User> _hasher;
    private readonly IUserRepo _userRepo;

    public UserService(LearnHubDbContext db, IPasswordHasher<User> hasher, IUserRepo userRepo)
    {
        _db = db;
        _hasher = hasher;
        _userRepo = userRepo;
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
        //validate if email exists
        if(await _userRepo.EmailExistsAsync(email))
            return "Email already registered -- testing";
        
        
        //validate if user exists
        if(await _userRepo.UsernameExistsAsync(username))
            return "Username already registered -- testing";

            

        var user = new User
        {
            Username = username,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Bio = bio,
            Role = UserRoles.Student
        };

        user.PasswordHash = _hasher.HashPassword(user, password);

        var student = new Student
        {
            User = user,
            BirthDate = DateOnly.Parse(birthDate)
        };

        await _userRepo.RegisterStudentAsync(student);
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