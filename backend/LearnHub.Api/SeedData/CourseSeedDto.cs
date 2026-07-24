

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
    public int ProfessorId { get; set; }
}