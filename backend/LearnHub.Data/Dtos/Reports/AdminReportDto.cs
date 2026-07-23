namespace LearnHub.Data.Dtos.Reports;

public class AdminReportDto
{
    public int TotalCourses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalEnrollments { get; set; }
    public List<TopCourseDto> TopCourses { get; set; } = new List<TopCourseDto>();
}
