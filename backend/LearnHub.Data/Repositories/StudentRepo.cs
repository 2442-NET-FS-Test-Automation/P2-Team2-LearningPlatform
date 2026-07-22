

using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class StudentRepo: IStudentRepo
{
    private readonly LearnHubDbContext _context;
    private readonly IUserRepo _userRepo;

    public StudentRepo( LearnHubDbContext context, IUserRepo userRepo)
    {
        _userRepo = userRepo;
        _context = context;
    }

    public void Add(Student student)
    {
        _context.Students.Add(student);
    }

    public async Task<Student?> GetByIdAsync(int id)
    {
        return await _context.Students
            .Include(s => s.User)
            .Include(s => s.StudentCourses)
                .ThenInclude(sc => sc.Course)
            .FirstOrDefaultAsync(s => s.Id == id);
    }
}