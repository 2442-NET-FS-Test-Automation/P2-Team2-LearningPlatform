using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;


namespace LearnHub.Data.Repositories;

public class CourseRepo : ICourseRepo
{
    // our dbContext
    private readonly LearnHubDbContext _context;

    // Builder
    public CourseRepo(LearnHubDbContext context)
    {
        _context = context;
    }

    // Function for get all the courses
    public async Task<PagedResult<Course>> GetAllAsync(int page, int pageSize, string? search = null, CourseCategory? categoryFilter = null, bool? isActiveFilter = null)
    {
        // Create a query from the context of Courses
        var query = _context.Courses
            .Include(c => c.StudentCourses)
            .AsQueryable();

        // filter first
        if (isActiveFilter != null) query = query.Where(c => c.IsActive == isActiveFilter);
        if (categoryFilter != null) query = query.Where(c => c.CategoryName == categoryFilter);
        if (search != null) query = query.Where(c => c.Name.ToLower().Contains(search.ToLower()));

        // await for know the count of the items
        var totalItems = await query.CountAsync();

        // Create the var courses in base of the query, implemented pagination and selecting the specific
        // data for our Dto
        var courses = await query
            .OrderBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // return a PagedResult<T>
        return new PagedResult<Course>
        {
            Items = courses,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    public async Task<PagedResult<Course>> GetCoursesOfStudentAsync(int page, int pageSize, int studentId)
    {
        // Create a query from the context of Courses
        var query = _context.Courses.Include(c => c.StudentCourses).Include(c => c.Schedule).AsQueryable();

        // filter first
        query = query.Where(c => c.StudentCourses.Any(sc => sc.StudentId == studentId));

        // await for know the count of the items
        var totalItems = await query.CountAsync();

        // Create the var courses in base of the query, implemented pagination and selecting the specific
        // data for our Dto
        var courses = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // return a PagedResult<T>
        return new PagedResult<Course>
        {
            Items = courses,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };
    }

    // This function dont have an endpoint, only for logical purposes
    // because didnt want to expose the table Course for the users
    public async Task<Course?> GetByIdAsync(int id)
    {
        // return the first item with the matching id
        return await _context.Courses
            .Include(c => c.Professor)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<CourseSchedule>> GetCourseScheduleById(int id)
    {
        return await _context.CourseSchedules.Where(cs => cs.CourseId == id).ToListAsync();
    }

    public async Task<Course> CreateAsync(Course course)
    {
        // Add the course parameter to our db context
        _context.Courses.Add(course);
        // Save the changes in the ChangeTracker();
        await _context.SaveChangesAsync();

        return course;
    }
    public async Task UpdateAsync(Course course)
    {
        // Update our db context course with course parameter
        _context.Courses.Update(course);

        // save changes
        await _context.SaveChangesAsync();
    }

    // In our application we didnt want to delete a course, only a logical Delete
    // in this case only we want to deactivate the course 
    public async Task DeleteAsync(Course course)
    {
        // Deactivate the course
        course.IsActive = false;

        // Save changes
        await _context.SaveChangesAsync();
    }
    // i dont want to write more comments :c

    // This function is gonna be moved to a ProfessorRepo
    public async Task<bool> ProfessorExistsAsync(int id)
    {
        // await for the search of a Professor with match id, if 
        // ther is a Professor match, return true, other case return false
        return await _context.Professors
            .AnyAsync(p => p.Id == id);
    }
    // public async Task<bool> CourseExistsAsync(int id)
    // {
    //     return await _context.Courses
    //         .AnyAsync(c => c.Id == id);
    // }
    public async Task<int> GetEnrollmentCountAsync(int courseId)
    {
        return await _context.StudentCourses.CountAsync(sc => sc.CourseId == courseId);
    }

    public async Task AddStudentAsync(
        int studentId,
        int courseId)
    {
        var exists = await _context.StudentCourses
            .AnyAsync(sc =>
                sc.StudentId == studentId &&
                sc.CourseId == courseId);

        if(exists)
            return;

        var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);;

        if(course is null) throw new KeyNotFoundException("Course not found.");

        var studentCourse = new StudentCourse
        {
            StudentId = studentId,
            CourseId = courseId
        };

        _context.StudentCourses.Add(studentCourse);

        await _context.SaveChangesAsync();
    }

    public async Task RemoveStudentAsync(
        int studentId,
        int courseId)
    {
        var studentCourse =
            await _context.StudentCourses
            .FirstOrDefaultAsync(sc =>
                sc.StudentId == studentId &&
                sc.CourseId == courseId);


        if(studentCourse == null)
            return;


        _context.StudentCourses.Remove(studentCourse);

        await _context.SaveChangesAsync();
    }

    public async Task AssignProfessorAsync(
        int courseId,
        int professorId)
    {
        var course =
            await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId);


        if(course == null)
            return;


        course.ProfessorId = professorId;


        await _context.SaveChangesAsync();
    }

    public async Task RemoveProfessorAsync(
        int courseId)
    {
        var course =
            await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId);


        if(course == null)
            return;


        course.ProfessorId = null;


        await _context.SaveChangesAsync();
    }

    public async Task<List<Course>> GetByProfessorAsync(int professorId)
    {
        return await _context.Courses
            .Where(c => c.ProfessorId == professorId)
            .ToListAsync();
    }

    public async Task UpdateScheduleAsync(int courseId, List<CourseSchedule> schedules)
    {
        var existing = await _context.CourseSchedules
            .Where(cs => cs.CourseId == courseId)
            .ToListAsync();

        _context.CourseSchedules.RemoveRange(existing);

        foreach (var s in schedules)
        {
            s.CourseId = courseId;
            _context.CourseSchedules.Add(s);
        }

        await _context.SaveChangesAsync();
    }
    public async Task<bool> IsCourseActiveAsync(int courseId)
    {
        return await _context.Courses
            .AnyAsync(c => c.Id == courseId && c.IsActive);
    }
    public async Task<bool> IsCourseCompleted(int studentId, int courseId)
    {
        var studentCourse = await _context.StudentCourses.FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);
        if (studentCourse == null) return false;
        return studentCourse.EndDate != null;
    }

    public async Task<List<int>> GetCompletedCourseIdsForStudent(int studentId, List<int> courseIds)
    {
        var studentCourses = await _context.StudentCourses.Where(sc => sc.StudentId == studentId && courseIds.Contains(sc.CourseId) && sc.EndDate != null).ToListAsync();
        return studentCourses.Select(sc => sc.CourseId).ToList();
    }
}