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
    private readonly ICourseRepo _courseRepo;
    private readonly ILogger<UserService> _logger;


    public UserService(LearnHubDbContext db, IPasswordHasher<User> hasher, 
        IProfessorRepo professorRepo, 
        IStudentRepo studentRepo,
        IUserRepo userRepo,
        ICourseRepo courseRepo,
        ILogger<UserService> logger)
    {
        _db = db;
        _hasher = hasher;
        _professorRepo = professorRepo;
        _studentRepo = studentRepo;
        _userRepo = userRepo;
        _courseRepo = courseRepo;
        _logger = logger;
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
        _logger.LogInformation("Registration attempt for user {Username}", username);
        //validate if email exists
        if(await _userRepo.EmailExistsAsync(email))
        {
            _logger.LogWarning("Registration rejected, {Email} already registered", email);
            return "Email already registered";
        }
            
        
        
        //validate if user exists
        if(await _userRepo.UsernameExistsAsync(username))
        {
            _logger.LogWarning("Registration rejected, {Username} username is already registered", username);
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

        user.PasswordHash = _hasher.HashPassword(user, password);


        var date = DateOnly.Parse(birthDate);
        // Console.WriteLine(date); //to be REMOVED

        if(date > DateOnly.FromDateTime(DateTime.Today))
        {
            _logger.LogWarning("Registration rejected, birth date cannot be in the future");
            return "Birth date cannot be in the future";
        }

        if(date > DateOnly.FromDateTime(DateTime.Today.AddYears(-12)))
        {
            _logger.LogWarning("Registraton rejected, you must be at least 12 years old to register");
            return "You must be at least 12 years old to register";
        }
        

        var student = new Student
        {
            User = user,
            BirthDate = date
        };

        await _studentRepo.AddAsync(student);

        _logger.LogInformation("User {Username} registered successfully", username);
        return null;
    }

    public async Task<User?> CreateUserAsync(CreateUserDto dto)
    {
        if(await _userRepo.EmailExistsAsync(dto.Email))
        {
            _logger.LogWarning("Email already exists {Email}", dto.Email);
            throw new ArgumentException("Email already exists");
        }

        if(await _userRepo.UsernameExistsAsync(dto.Username))
        {
            _logger.LogWarning("Username already exists {Username}", dto.Username);
            throw new ArgumentException("Username already exists");
        }
            
        if (!Enum.TryParse<UserRoles>(dto.Role, true, out var role))
        {
            _logger.LogWarning("Invalid role {Role}", dto.Role);
            throw new ArgumentException("Invalid role");
        }
        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            
            var user = CreateBaseUser(dto, role);

            _userRepo.Add(user);

            if(role == UserRoles.Professor)
            {
                if(dto.ShiftId == null || dto.ContractDate == null)
                {
                    _logger.LogWarning("Professor data missing {ShiftId} and {ContractDate}", dto.ShiftId, dto.ContractDate);
                    throw new ArgumentException("Professor data missing");
                }
            }
            switch(role)
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
            _logger.LogInformation("User {Username} created successfully", user.Username);

            return user;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error creating user {Username}", dto.Username);
            throw;
        }
    }

    private  User CreateBaseUser(CreateUserDto dto, UserRoles role)
    {
        var user = new User
        {
            Username = dto.Username,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Bio = dto.Bio,
            Role = role
        };

        user.PasswordHash =
            _hasher.HashPassword(user, dto.Password);

        

        return user;
    }

    public async Task<User?> UpdateUserAsync(
        User user,
        UpdateUserDto dto)
    {
        if (user == null) return null;

        if (dto.Email != null && await _userRepo.EmailExistsAsync(dto.Email)) throw new Exception("Email is already taken");
        if (dto.Username != null && await _userRepo.UsernameExistsAsync(dto.Username)) throw new Exception("Username is already taken");

        // USER DATA
        user.Username = dto.Username ?? user.Username;
        user.FirstName = dto.FirstName ?? user.FirstName;
        user.LastName = dto.LastName ?? user.LastName;
        user.Email = dto.Email ?? user.Email;
        user.Bio = dto.Bio ?? user.Bio;

        // STUDENT DATA
        if(user.Student != null)
        {
            if(dto.BirthDate.HasValue)
            {
                user.Student.BirthDate = dto.BirthDate.Value;
            }
            if(dto.StudentCourseIds != null)
            {
                await UpdateStudentCoursesAsync(
                    user.Student.Id,
                    dto.StudentCourseIds
                );
            }
        }

        // PROFESSOR DATA
        if(user.Professor != null)
        {
            if(dto.ShiftId.HasValue)
            {
                user.Professor.ShiftId = dto.ShiftId.Value;
            }

            if(dto.ContractDate.HasValue)
            {
                user.Professor.ContractDate = dto.ContractDate.Value;
            }

            if(dto.ProfessorCourseIds != null)
            {
                await UpdateProfessorCoursesAsync(
                    user.Professor.Id,
                    dto.ProfessorCourseIds
                );
            }
        }

        await _userRepo.UpdateAsync(user);
        _logger.LogInformation("User {Username} updated successfully", user?.Username);

        return user;
    }
    public async Task<User?> LoginUserAsync(string emailOrUsername, string password)
    {
        //validate if user exists
        User? foundUser = await _userRepo.GetByEmailOrUsernameAsync(emailOrUsername);

        if(foundUser is null) {
            _logger.LogWarning("Login failed, user not found: {EmailOrUsername}", emailOrUsername);
            return null;
        }

        //verify password
        var result = _hasher.VerifyHashedPassword(foundUser, foundUser.PasswordHash, password);

        if(result != PasswordVerificationResult.Success)
        {
            _logger.LogWarning("Login failed: invalid password for user {Username}", foundUser?.Username);
            return null;
        }

        _logger.LogInformation("User {Username} logged in successfully", foundUser?.Username);
        return foundUser;
    }

    public async Task<bool> UpdateStudentCoursesAsync(
        int studentId,
        List<int> courseIds)
    {
        var student = await _studentRepo.GetByIdAsync(studentId);

        if(student == null)
        {
            _logger.LogWarning("Student not found {StudentId}", studentId);
            return false;
        }


        var currentCourses = student.StudentCourses
            .Select(sc => sc.CourseId)
            .ToList();


        // Cursos que se deben agregar
        var coursesToAdd = courseIds
            .Except(currentCourses)
            .ToList();


        // Cursos que se deben eliminar
        var coursesToRemove = currentCourses
            .Except(courseIds)
            .ToList();



        foreach(var courseId in coursesToAdd)
        {
            if(!await _courseRepo.IsCourseActiveAsync(courseId))
            {
                throw new InvalidOperationException(
                    "Cannot assign inactive course"
                );
            }

            await _courseRepo.AddStudentAsync(
                studentId,
                courseId);
        }



        foreach(var courseId in coursesToRemove)
        {
            await _courseRepo.RemoveStudentAsync(
                studentId,
                courseId);
        }

        _logger.LogInformation("Student {StudentId} courses updated successfully", studentId);
        return true;
    }

    public async Task<bool> UpdateProfessorCoursesAsync(
        int professorId,
        List<int> courseIds)
    {
        var professor = await _professorRepo.GetByIdAsync(professorId);

        if(professor == null)
        {
            _logger.LogWarning("Professor not found {ProfessorId}", professorId);
            return false;
        }


        var currentCourses = professor.Courses
            .Select(c => c.Id)
            .ToList();



        var coursesToAdd = courseIds
            .Except(currentCourses)
            .ToList();



        var coursesToRemove = currentCourses
            .Except(courseIds)
            .ToList();

        foreach(var courseId in coursesToAdd)
        {
            if(!await _courseRepo.IsCourseActiveAsync(courseId))
            {
                throw new InvalidOperationException(
                    "Cannot assign inactive course"
                );
            }

            await _courseRepo.AssignProfessorAsync(
                courseId,
                professorId);
        }



        foreach(var courseId in coursesToRemove)
        {
            await _courseRepo.RemoveProfessorAsync(
                courseId);
        }

        _logger.LogInformation("Professor {ProfessorId} courses updated successfully", professorId);
        return true;
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
    }
    
    public async Task<bool> PromoteToProfessorAsync(
        int userId,
        PromoteProfessorDto dto)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("Promote failed: user not found {UserId}", userId);
                return false;
            }

            if (user.Student == null)
            {
                _logger.LogWarning("Promote failed: user {UserId} is not a student", userId);
                return false;
            }

            if (user.Professor != null)
            {
                _logger.LogWarning("Promote failed: user {UserId} is already a professor", userId);
                return false;
            }

            user.Role = UserRoles.Professor;

            var professor = new Professor
            {
                UserId = user.Id,
                ShiftId = dto.ShiftId,
                ContractDate = dto.ContractDate,
                IsActive = true
            };

            _professorRepo.Add(professor);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("User {UserId} promoted to professor successfully", userId);
            return true;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error promoting user {UserId}", userId);
            throw;
        }
    }
}