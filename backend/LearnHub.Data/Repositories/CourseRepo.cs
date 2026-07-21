using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;
using LearnHub.Data;
using LearnHub.Data.Dtos.Courses;

namespace LearnHub.Data.Repositories;

public class CourseRepo : ICourseRepo
{
    private readonly LearnHubDbContext _context;

    public CourseRepo(LearnHubDbContext context)
    {
        _context = context;
    }
    public async Task<PagedResult<CourseListDto>> GetAllAsync(
    int page,
    int pageSize,
    bool? active = null)
    {
        var query = _context.Courses.AsQueryable();

        if (active.HasValue)
        {
            query = query.Where(c => c.IsActive == active.Value);
        }

        var totalItems = await query.CountAsync();

        var courses = await query
            .OrderBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CourseListDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Category = c.CategoryName
            })
            .ToListAsync();

        return new PagedResult<CourseListDto>
        {
            Items = courses,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<CourseDetailDto?> GetByIdDetailedAsync(int id)
    {
        return await _context.Courses
            .Include(c => c.Professor)
                .ThenInclude(p => p.User)
            .Include(c => c.Schedule)
            .Where(c => c.Id == id)
            .Select(c => new CourseDetailDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                About = c.About,
                Category = c.CategoryName,
                Price = c.EnrollmentPrice,
                Hours = c.Hours,
                Certification = c.Certification,

                Instructor =
                    c.Professor.User.FirstName + " " +
                    c.Professor.User.LastName,

                EnrolledStudents = _context.StudentCourses
                    .Count(sc => sc.CourseId == c.Id),

                Schedule = c.Schedule
                    .Select(s => new CourseScheduleDto
                    {
                        Day = s.Day,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Course> CreateAsync(Course course)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return course;
    }
    public async Task UpdateAsync(Course course)
    {
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
    }


    public async Task DeleteAsync(Course course)
    {
        course.IsActive = false;

        await _context.SaveChangesAsync();
    }
    public async Task<bool> ProfessorExistsAsync(int id)
    {
        return await _context.Professors
            .AnyAsync(p => p.Id == id);
    }
    // public async Task<bool> CourseExistsAsync(int id)
    // {
    //     return await _context.Courses
    //         .AnyAsync(c => c.Id == id);
    // }
}