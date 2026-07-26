
namespace LearnHub.Data.Entities;

public class ActivitySubmission
{
    public int Id { get; set; }
    public int ActivityId { get; set; }
    public int StudentId { get; set; }

    public string? File { get; set; } 
    public string? Feedback { get; set; } 
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? GradedAt { get; set; }
    public decimal? Score { get; set; }

    // Navigation properties
    public Activity Activity { get; set; } = default!;
    public Student Student { get; set; } = default!;
}