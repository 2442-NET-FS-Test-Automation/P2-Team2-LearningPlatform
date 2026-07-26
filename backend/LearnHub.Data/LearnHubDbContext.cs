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
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<ActivitySubmission> ActivitySubmissions => Set<ActivitySubmission>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StudentCourse>()
            .HasOne(s => s.Student)
            .WithMany(s => s.StudentCourses)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StudentCourse>()
            .HasOne(s => s.Course)
            .WithMany(s => s.StudentCourses)
            .HasForeignKey(s => s.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .Property(p => p.Role)
            .HasConversion<string>();

        modelBuilder.Entity<Course>()
            .Property(p => p.CategoryName)
            .HasConversion<string>();

        modelBuilder.Entity<Activity>()
            .HasOne(a => a.Course)
            .WithMany(c => c.Activities)
            .HasForeignKey(a => a.CourseId);

        modelBuilder.Entity<Activity>()
            .HasOne(a => a.CreatedBy)
            .WithMany()
            .HasForeignKey(a => a.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ActivitySubmission>()
            .HasOne(s => s.Activity)
            .WithMany(a => a.Submissions)
            .HasForeignKey(s => s.ActivityId);

        modelBuilder.Entity<ActivitySubmission>()
            .HasOne(s => s.Student)
            .WithMany()
            .HasForeignKey(s => s.StudentId);

        modelBuilder.Entity<ActivitySubmission>()
            .HasIndex(s => new { s.ActivityId, s.StudentId })
            .IsUnique();
        
        modelBuilder.Entity<ActivitySubmission>()
            .Property(s => s.Score)
            .HasPrecision(5, 2);
    }
}