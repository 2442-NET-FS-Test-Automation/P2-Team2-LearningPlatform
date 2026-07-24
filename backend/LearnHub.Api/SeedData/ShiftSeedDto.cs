

namespace LearnHub.Api.SeedData;

public class ShiftSeedDto {
    public string Name { get; set; } = default!;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}