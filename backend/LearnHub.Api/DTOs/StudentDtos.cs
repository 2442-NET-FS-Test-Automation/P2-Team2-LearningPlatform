namespace LearnHub.Api.DTOs.Students;

public class StudentDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Username { get; set; } = default!;

    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string? Bio { get; set; }

    public DateOnly BirthDate { get; set; }
}

public class StudentDetailDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Username { get; set; } = default!;

    public string FullName { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string? Bio { get; set; }

    public DateOnly BirthDate { get; set; }

    public IEnumerable<StudentCourseDto> Courses { get; set; } = [];
}

public class StudentCourseDto
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public string CourseName { get; set; } = default!;

    public int? Grade { get; set; }

    public DateOnly EnrollmentDate { get; set; }

    public DateOnly? EndDate { get; set; }
}

public class UserInfoDto
{
    public int Id { get; set; }

    public string Username { get; set; } = default!;

    public string FullName { get; set; } = default!;

    public string Email { get; set; } = default!;
}