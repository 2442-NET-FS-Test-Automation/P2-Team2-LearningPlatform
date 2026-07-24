using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System.Text.Json;
using LearnHub.Api.SeedData;


namespace LearnHub.Api.Services;


public class Seeder: ISeeder {

    private readonly LearnHubDbContext _db;
    private readonly IPasswordHasher<User> _hasher;


    private static async Task<T> LoadAsync<T>(string fileName)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "SeedData", fileName);
        await using var stream = File.OpenRead(path);
        var data = await JsonSerializer.DeserializeAsync<T>(
            stream,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        return data ?? throw new InvalidOperationException($"Failed to load {fileName}");
    }


    public Seeder(LearnHubDbContext db, IPasswordHasher<User> hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    // public async Task SeedAsync() 
    // {
    //     if (await _db.Users.AnyAsync())
    //     return;


    //     //Generate shifts
    //     var morning = new Shift
    //     {
    //         Name = "Morning",
    //         StartTime  = new(8,0),
    //         EndTime = new(12,0)
    //     };
    //     _db.Shifts.Add(morning);
    //     await _db.SaveChangesAsync();

        
    //     //Generte users + professors
    //     var user = new User 
    //     {
    //         Username = "prof1",
    //         Email = "prof1@example.com",
    //         FirstName = "Jhon",
    //         LastName = "Doe",
    //         Role = UserRoles.Professor,
    //         Bio = "Demo professor"
    //     };
    //     user.PasswordHash = _hasher.HashPassword(user, "password123");

    //     _db.Users.Add(user);


    //     var professor = new Professor 
    //     {
    //         UserId = user.Id,
    //         ShiftId = morning.Id,
    //         ContractDate = DateOnly.FromDateTime(DateTime.Now),
    //         IsActive = true
    //     };
    //     _db.Professors.Add(professor);
    //     await _db.SaveChangesAsync();



    //     //Courses
    //     _db.Courses.Add( new Course {
    //         ProfessorId = professor.Id,
    //         Name = "Intro to C#",
    //         Description = "A course about the basics of C#",
    //         CategoryName = CourseCategory.Programming,
    //         Capacity = 30,
    //         EnrollmentPrice = 99.99m,
    //         IsActive = true,
    //         About = "This course is about the basics of C#",
    //         Certification = true,
    //         Hours = 40
    //     });

    //     await _db.SaveChangesAsync();
    // }

    
    public async Task SeedAsync() {
        if(await _db.Users.AnyAsync()) return;

        var shiftDtos = await LoadAsync<List<ShiftSeedDto>>("shifts.json");
        var usersProfessorsDtos = await LoadAsync<List<UserProfessorsSeedDto>>("users-profesors.json");
        var coursesDtos = await LoadAsync<List<CourseSeedDto>>("course.json");
      

        //1 - shifts
        foreach (var shift in shiftDtos) {
            _db.Shifts.Add(new Shift
            {
                Name = shift.Name,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime
            });
        }
        await _db.SaveChangesAsync();


        //2 - users (professors + students)
        foreach (var up in usersProfessorsDtos) {
            var role = Enum.Parse<UserRoles>(up.Role);

            var user = new User
            {
                Username = up.Username,
                Email = up.Email,
                FirstName = up.FirstName,
                LastName = up.LastName,
                Role = role,
                Bio = up.Bio
            };

            user.PasswordHash = _hasher.HashPassword(user, up.Password);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            if (role == UserRoles.Professor)
            {
                if (string.IsNullOrWhiteSpace(up.ShiftName) || up.ContractDate is null)
                    throw new InvalidOperationException($"Professor data missing for user {up.Username}");

                var shift = await _db.Shifts.FirstOrDefaultAsync(s => s.Name == up.ShiftName);
                if (shift == null)
                    throw new InvalidOperationException($"Shift with name {up.ShiftName} not found");

                _db.Professors.Add(new Professor
                {
                    UserId = user.Id,
                    ShiftId = shift.Id,
                    ContractDate = up.ContractDate.Value,
                    IsActive = up.IsActive ?? true
                });
            }
            else if (role == UserRoles.Student)
            {
                if (up.BirthDate is null)
                    throw new InvalidOperationException($"Student birthDate missing for user {up.Username}");

                _db.Students.Add(new Student
                {
                    UserId = user.Id,
                    BirthDate = up.BirthDate.Value
                });
            }

            await _db.SaveChangesAsync();
        }


        //3 - courses
        // professorId in JSON is a 1-based index among seeded professors (not DB identity),
        // so this still works if SQL identity does not restart at 1 after prior deletes.
        var professors = await _db.Professors.OrderBy(p => p.Id).ToListAsync();
        if (professors.Count == 0)
            throw new InvalidOperationException("No professors were seeded");

        foreach (var c in coursesDtos)
        {
            if (c.ProfessorId < 1 || c.ProfessorId > professors.Count)
                throw new InvalidOperationException(
                    $"Professor index {c.ProfessorId} not found (seeded {professors.Count} professors)");

            var professor = professors[c.ProfessorId - 1];

            var course = new Course
            {
                ProfessorId = professor.Id,
                Name = c.Name,
                Description = c.Description,
                CategoryName = Enum.Parse<CourseCategory>(c.CategoryName),
                Capacity = c.Capacity,
                EnrollmentPrice = c.EnrollmentPrice,
                IsActive = c.IsActive,
                About = c.About,
                Certification = c.Certification,
                Hours = c.Hours
            };
            _db.Courses.Add(course);
            await _db.SaveChangesAsync();
        }
    }





}