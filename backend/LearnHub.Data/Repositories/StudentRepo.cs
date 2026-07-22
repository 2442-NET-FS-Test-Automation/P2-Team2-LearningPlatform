

using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

public class StudentRepo: IStudentRepo
{
    private readonly LearnHubDbContext _context;
    private readonly IUserRepo _userRepo;

    public StudentRepo( LearnHubDbContext context, IUserRepo userRepo)
    {
        _userRepo = userRepo;
        _context = context;
    }

    public async Task<Student?> CreateAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }
}