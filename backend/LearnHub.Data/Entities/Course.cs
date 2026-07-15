using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Entities;

public class Course
{
    public int Id { get; set; }
    public int ProfessorId { get; set; }
    public Professor Professor { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public CourseCategory CategoryName { get; set; }
    public int Capacity { get; set; }
    public ICollection<CourseSchedule> Schedule { get; set; } = new List<CourseSchedule>();

    [Precision(10, 2)]
    public decimal EnrollmentPrice { get; set; }
    public bool IsActive { get; set; }
}