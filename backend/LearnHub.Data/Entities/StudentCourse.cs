namespace LearnHub.Data.Entities;

public class StudentCourse
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = default!;
    public int CourseId { get; set; }
    public Course Course { get; set; } = default!;
    public int? Grade { get; set; }
    public DateOnly EnrollmentDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
    public DateOnly? EndDate { get; set; }

}