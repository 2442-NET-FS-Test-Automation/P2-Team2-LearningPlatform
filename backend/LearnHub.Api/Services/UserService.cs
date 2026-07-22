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


        var date = DateOnly.Parse(birthDate);
        Console.WriteLine(date);

        if(date > DateOnly.FromDateTime(DateTime.Today))
            return "Birth date cannot be in the future";

        if(date > DateOnly.FromDateTime(DateTime.Today.AddYears(-12)))
            return "You must be at least 12 years old to register";
        

        var student = new Student
        {
            User = user,
            BirthDate = date
        };

        await _studentRepo.AddAsync(student);
        return null;
    }

    public async Task<User?> CreateUserAsync(CreateUserDto dto)
    {
        if(await _userRepo.EmailExistsAsync(dto.Email))
            throw new ArgumentException("Email already exists");

        if(await _userRepo.UsernameExistsAsync(dto.Username))
            throw new ArgumentException("Username already exists");
            
        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            
            var user = CreateBaseUser(dto);

            _userRepo.Add(user);

            if(dto.Role == UserRoles.Professor)
            {
                if(dto.ShiftId == null || dto.ContractDate == null)
                    throw new ArgumentException("Professor data missing");
            }
            switch(dto.Role)
            {
                case UserRoles.Professor:

                    _professorRepo.Add(new Professor
                    {
                        User = user,
                        ShiftId = dto.ShiftId!.Value,
                        ContractDate = dto.ContractDate!.Value,
                        IsActive = true
                    });

                    break;


                case UserRoles.Student:

                    _studentRepo.Add(new Student
                    {
                        User = user,
                        BirthDate = dto.BirthDate!.Value
                    });

                    break;
                
                case UserRoles.Admin:
                    break;
            }

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();

            return user;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private  User CreateBaseUser(CreateUserDto dto)
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