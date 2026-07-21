namespace LearnHub.Data.Dtos.Courses;

using LearnHub.Data;

public class CourseListDto
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public CourseCategory Category { get; set; }
}

public class CourseScheduleDto
{
    public DayOfWeek Day { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }
}

public class CourseDetailDto
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public string About { get; set; } = default!;

    public CourseCategory Category { get; set; }

    public string Instructor { get; set; } = default!;

    public decimal Price { get; set; }

    public int EnrolledStudents { get; set; }

    public int Hours { get; set; }

    public bool Certification { get; set; }

    public List<CourseScheduleDto> Schedule { get; set; } = [];
}

public class CreateCourseDto
{
    public int ProfessorId { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public string About { get; set; } = default!;

    public CourseCategory Category { get; set; }

    public int Capacity { get; set; }

    public bool Certification { get; set; }

    public int Hours { get; set; }

    public decimal Price { get; set; }
}

public class UpdateCourseDto
{
    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? About { get; set; }

    public CourseCategory? Category { get; set; }

    public int? Capacity { get; set; }

    public bool? Certification { get; set; }

    public int? Hours { get; set; }

    public decimal? Price { get; set; }

    public bool? IsActive { get; set; }
}