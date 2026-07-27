using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

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
    
    public async Task<string?> SeedAsync() {
        
        await _db.Database.EnsureDeletedAsync();
        await _db.Database.MigrateAsync();
        // return "Data found. Clean up and fresh data seeded";
        

            

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
        var professors = await _db.Professors
            .Include(p => p.User)
            .ToListAsync();
        if (professors.Count == 0)
            throw new InvalidOperationException("No professors were seeded");

        var professorsByUsername = professors.ToDictionary(
            p => p.User.Username,
            StringComparer.OrdinalIgnoreCase);

        var students = await _db.Students.OrderBy(s => s.Id).ToListAsync();

        foreach (var c in coursesDtos)
        {
            if (string.IsNullOrWhiteSpace(c.ProfessorUsername))
                throw new InvalidOperationException(
                    $"Course '{c.Name}' does not specify a professor username");

            if (!professorsByUsername.TryGetValue(c.ProfessorUsername, out var professor))
                throw new InvalidOperationException(
                    $"Professor '{c.ProfessorUsername}' assigned to course '{c.Name}' was not found");

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


            foreach(var schedule in c.Schedule) 
            {
                var courseSchedule = new CourseSchedule
                {
                    CourseId = course.Id,
                    Day = Enum.Parse<DayOfWeek>(schedule.Day),
                    StartTime = TimeOnly.Parse(schedule.StartTime.ToString()),
                    EndTime = TimeOnly.Parse(schedule.EndTime.ToString())
                };
                _db.CourseSchedules.Add(courseSchedule);
                await _db.SaveChangesAsync();
            }



            //3.1 - activities
            foreach (var a in c.Activities)
            {
                var activity = new Activity
                {
                    CourseId = course.Id,
                    CreatedByUserId = professor.UserId, // professor of this course
                    Title = a.Title,
                    Description = a.Description,
                    DueDate = a.DueDate,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = a.IsActive
                };
                _db.Activities.Add(activity);
                await _db.SaveChangesAsync();
                foreach (var sub in a.Submissions)
                {
                    if (sub.StudentIndex < 1 || sub.StudentIndex > students.Count)
                        throw new InvalidOperationException($"Bad studentIndex {sub.StudentIndex}");
                    _db.ActivitySubmissions.Add(new ActivitySubmission
                    {
                        ActivityId = activity.Id,
                        StudentId = students[sub.StudentIndex - 1].Id,
                        File = sub.File,
                        Feedback = sub.Feedback,
                        Score = sub.Score,
                        SubmittedAt = DateTime.UtcNow.AddDays(-2),
                        GradedAt = sub.GradedAt
                    });
                }
                await _db.SaveChangesAsync();
            }
        }

        //4 - student courses
        var courses = await _db.Courses.OrderBy(c => c.Id).ToListAsync();

        for (var i = 0; i < students.Count; i++)
        {
            var course = courses[i % courses.Count]; // rotate
            _db.StudentCourses.Add(new StudentCourse
            {
                StudentId = students[i].Id,
                CourseId = course.Id,
                EnrollmentDate = DateOnly.FromDateTime(DateTime.UtcNow)
            });
        }
        await _db.SaveChangesAsync();


        





        return null;
    }
}
