using LearnHub.Api.DTOs.Users;
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
    private readonly IProfessorRepo _professorRepo;
    private readonly IStudentRepo _studentRepo;
    private readonly IUserRepo _userRepo;

    public UserService(LearnHubDbContext db, IPasswordHasher<User> hasher, 
        IProfessorRepo professorRepo, 
        IStudentRepo studentRepo,
        IUserRepo userRepo)
    {
        _db = db;
        _hasher = hasher;
        _professorRepo = professorRepo;
        _studentRepo = studentRepo;
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

    public async Task<User?> CreateUserAsync(CreateUserDto dto)
    {
        var user = await CreateBaseUserAsync(dto);

        switch (dto.Role)
        {
            case UserRoles.Professor:
                await _professorRepo.CreateAsync(new Professor
                {
                    UserId = user.Id,
                    ShiftId = dto.ShiftId!.Value,
                    ContractDate = dto.ContractDate!.Value,
                    IsActive = true
                });
                break;
                
        }

        return user;
    }

    private async Task<User> CreateBaseUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Bio = dto.Bio,
            Role = dto.Role
        };

        user.PasswordHash =
            _hasher.HashPassword(user, dto.Password);
        
        await _userRepo.CreateAsync(user);

        return user;
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