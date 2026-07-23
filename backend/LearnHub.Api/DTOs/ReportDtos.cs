namespace LearnHub.Api.DTOs.Reports;

public class AdminReportDto
{
    public int TotalCourses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalEnrollments { get; set; }
    public List<TopCourseDto> TopCourses { get; set; } = new List<TopCourseDto>();
}

public class TopCourseDto
{
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public int EnrollmentCount { get; set; }
}
