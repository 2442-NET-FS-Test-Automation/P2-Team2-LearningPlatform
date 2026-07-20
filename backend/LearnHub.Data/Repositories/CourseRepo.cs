using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;
using LearnHub.Data;

namespace LearnHub.Data.Repositories;

public class CourseRepo : ICourseRepo
{
    private readonly LearnHubDbContext _context;

    public CourseRepo(LearnHubDbContext context)
    {
        _context = context;
    }
    public async Task<PagedResult<Course>> GetAllAsync(int page, int pageSize,
        bool? active = null)
    {
        var query = _context.Courses
            .Include(c => c.Professor)
            .AsQueryable();

        if (active.HasValue)
        {
            query = query.Where(c => c.IsActive == active);
        }

        var totalItems = await query.CountAsync();

        var courses = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();


        return new PagedResult<Course>
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
        var course = await _context.Courses
            .Include(c => c.Professor)
            .Include(c => c.Schedule)
            .FirstOrDefaultAsync(c => c.Id == id);

        return course;
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