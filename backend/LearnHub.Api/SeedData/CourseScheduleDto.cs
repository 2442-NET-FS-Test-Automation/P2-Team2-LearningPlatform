

namespace LearnHub.Api.SeedData;

public class CourseScheduleDto {
    public string Day { get; set; } = default!;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}