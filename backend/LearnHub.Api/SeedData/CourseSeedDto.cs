

namespace LearnHub.Api.SeedData;

public class CourseSeedDto {
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string CategoryName { get; set; } = default!;
    public int Capacity { get; set; }
    public decimal EnrollmentPrice { get; set; }
    public bool IsActive { get; set; }
    public string About { get; set; } = default!;
    public bool Certification { get; set; }
    public int Hours { get; set; }
    public string ProfessorUsername { get; set; } = default!;

    public List<CourseScheduleDto> Schedule { get; set; } = [];
    public List<ActivitySeedDto> Activities { get; set; } = [];
}

public class ActivitySeedDto
{
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
    public bool IsActive { get; set; } = true;
    public List<ActivitySubmissionSeedDto> Submissions { get; set; } = [];
}

public class ActivitySubmissionSeedDto
{
    public int StudentIndex { get; set; }
    public string? File { get; set; }
    public string? Feedback { get; set; }
    public decimal? Score { get; set; }
    public DateTime? GradedAt { get; set; }
}
