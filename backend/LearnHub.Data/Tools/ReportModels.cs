namespace LearnHub.Data.Tools;

public class AdminReportModel
{
    public int TotalCourses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalEnrollments { get; set; }
    public List<TopCourseModel> TopCourses { get; set; } = new List<TopCourseModel>();
}

public class TopCourseModel
{
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public int EnrollmentCount { get; set; }
}
