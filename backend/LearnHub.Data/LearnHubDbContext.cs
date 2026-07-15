using Microsoft.EntityFrameworkCore;

using LearnHub.Data.Entities;

namespace LearnHub.Data;

public class LearnHubDbContext(DbContextOptions<LearnHubDbContext> options) : DbContext (options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Professor> Professors => Set<Professor>();
    public DbSet<Shift> Shifts => Set<Shift>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<StudentCourse> StudentCourses => Set<StudentCourse>();
    public DbSet<CourseSchedule> CourseSchedules => Set<CourseSchedule>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StudentCourse>()
            .HasOne(s => s.Student)
            .WithMany()
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StudentCourse>()
            .HasOne(s => s.Course)
            .WithMany()
            .HasForeignKey(s => s.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .Property(p => p.Role)
            .HasConversion<string>();

        modelBuilder.Entity<Course>()
            .Property(p => p.CategoryName)
            .HasConversion<string>();
    }
}