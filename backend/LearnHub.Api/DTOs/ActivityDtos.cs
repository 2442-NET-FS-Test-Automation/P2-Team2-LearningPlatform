using System.ComponentModel.DataAnnotations;
public record ActivitySummaryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CourseName { get; set; } = default!;
    public string CreatedBy { get; set; } = default!;
    public int SubmissionsCount { get; set; } 
}


public record ActivityDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CourseName { get; set; } = default!;
    public string CreatedBy { get; set; } = default!;
    public List<ActivitySubmissionDto> Submissions { get; set; } = [];
}

public record ActivitySubmissionDto
{
    public int Id { get; set; }
    public string StudentName { get; set; } = default!;
    public string? File { get; set; }
    public decimal? Score { get; set; }
    public string? Feedback { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? GradedAt { get; set; }
}



public class CreateActivityDto
{
    public int CourseId { get; set; }

    [Required]
    [MinLength(3, ErrorMessage = "Title must be at least 3 characters")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = default!;

    [Required]
    [MinLength(10, ErrorMessage = "Description must be at least 10 characters")]
    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }
}

public class GradeSubmissionDto
{
    [Required]
    [MinLength(3, ErrorMessage = "Feedback must be at least 3 characters")]
    [MaxLength(500, ErrorMessage = "Feedback cannot exceed 500 characters")]
    public string Feedback { get; set; } = default!;

    [Range(0, 100, ErrorMessage = "Score must be between 0 and 100")]
    public decimal Score { get; set; }
}

public class CreateSubmissionDto
{
    [Required]
    [MinLength(1, ErrorMessage = "Submission cannot be empty")]
    [MaxLength(2000, ErrorMessage = "Submission cannot exceed 2000 characters")]
    public string File { get; set; } = default!;
}