namespace LearnHub.Data.Dtos.Reports;

public class TopCourseDto
{
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public int EnrollmentCount { get; set; }
}
