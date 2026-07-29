

using LearnHub.Data.Entities;

public interface IProfessorRepo
{
    void Add(Professor professor);
    Task<Professor?> GetByIdAsync(int id);
    Task<Professor?> GetByUserIdAsync(int id);
    Task<bool> ExistsByUserIdAsync(int userId);
    Task<Shift?> GetShiftByIdAsync(int userId);
    Task<ProfessorSummaryResult> GetProfessorSummaryAsync(int userId);
}

public class ProfessorSummaryResult
{
    public int TotalCourses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalActivities { get; set; }
    public int PendingSubmissionsToGrade { get; set; }
    public List<TopCourseItem> TopCourses { get; set; } = [];
}

public class TopCourseItem
{
    public int CourseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int EnrolledStudentsCount { get; set; }
}