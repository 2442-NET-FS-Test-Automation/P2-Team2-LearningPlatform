
using System.ComponentModel.DataAnnotations;
using LearnHub.Data;

namespace LearnHub.Api.DTOs.Courses;

public class CourseListDto
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public string Category { get; set; } = default!;

    public bool IsActive { get; set; }

    public decimal? Price { get; set; }
    public int IsFull { get; set; }
    public bool IsEnrolled{ get; set; }
    public bool? Completed { get; set; } = null;
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

    public string? About { get; set; } = default!;

    public string Category { get; set; } = default!;

    public string Instructor { get; set; } = default!;

    public decimal Price { get; set; }

    public int Capacity { get; set; }

    public int EnrolledStudents { get; set; }

    public int AvailableSeats => Capacity - EnrolledStudents;

    public int? Hours { get; set; }

    public bool IsActive { get; set; }

    public bool Certification { get; set; }

    public List<CourseScheduleDto> Schedule { get; set; } = [];
    public int? Grade { get; set; } = null;
    public bool? Completed { get; set; } = null;
}

public class CreateCourseDto
{
    public int ProfessorId { get; set; }

    [Required]
    [MinLength(3, ErrorMessage = "Name must be at least 3 characters")]
    [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = default!;

    [Required]
    [MinLength(10, ErrorMessage = "Description must be at least 10 characters")]
    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = default!;


    [Required]
    [MinLength(10, ErrorMessage = "About must be at least 10 characters")]
    [MaxLength(1000, ErrorMessage = "About cannot exceed 1000 characters")]
    public string About { get; set; } = default!;

    public CourseCategory Category { get; set; }

    [Range(1, 1000, ErrorMessage = "Capacity must be between 1 and 1000")]
    public int Capacity { get; set; }

    public bool Certification { get; set; }

    [Range(1, 10000, ErrorMessage = "Hours must be between 1 and 10000")]
    public int Hours { get; set; }


    [Range(0, 100000, ErrorMessage = "Price must be between 0 and 100000")]
    public decimal Price { get; set; }

    public List<CourseScheduleDto>? Schedule { get; set; }
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

    public List<CourseScheduleDto>? Schedule { get; set; }
}