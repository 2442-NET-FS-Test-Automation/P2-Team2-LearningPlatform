
namespace LearnHub.Data.Entities;

public class Activity
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public int CreatedByUserId { get; set; }

    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive{get; set;}

    // Navigation properties
    public Course Course { get; set; } = default!;
    public User CreatedBy { get; set; } = default!;
    public ICollection<ActivitySubmission> Submissions { get; set; } = [];
}