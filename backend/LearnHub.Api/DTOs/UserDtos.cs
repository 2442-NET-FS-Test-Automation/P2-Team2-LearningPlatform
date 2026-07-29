using System.ComponentModel.DataAnnotations;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Data;

namespace LearnHub.Api.DTOs.Users;

public class UserDto
{
    public int Id{get; set;}
    public string Role { get; set; } = UserRoles.Student.ToString();
    public string Username {get; set;} = default!;
    public string FirstName {get; set;} = default!;
    public string LastName{get; set;} = default!;
    public string Email{get; set;} = default!;
    public string? Bio {get; set;}
    public bool IsActive { get; set; }
}

public class PromoteProfessorDto
{
    public int ShiftId { get; set; }

    public DateOnly ContractDate { get; set; }
}

public class UserDetailsDto
{
    public int Id {get;set;}

    public string Username {get;set;} = default!;
    public string FirstName {get;set;}= default!;
    public string LastName {get;set;}= default!;
    public string Email {get;set;}= default!;
    public string Bio {get;set;}= default!;
    public string Role {get;set;} = default!;

    public StudentInfoDto? Student {get;set;}

    public ProfessorInfoDto? Professor {get;set;}
}

public class CreateUserDto
{
    // Datos comunes
    public string Username { get; set; } = default!;

    public string Password { get; set; } = default!;

    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string? Bio { get; set; }

    public string Role { get; set; } = UserRoles.Student.ToString();


    // Student
    public DateOnly? BirthDate { get; set; }


    // Professor
    public int? ShiftId { get; set; }

    public DateOnly? ContractDate { get; set; }
}

public class UpdateUserDto
{
    // User
    public string? Username {get;set;}
    public string? FirstName {get;set;}
    public string? LastName {get;set;}
    public string? Email {get;set;}
    public string? Bio {get;set;}
    public UserRoles? Role {get;set;}

    // Student
    public DateOnly? BirthDate {get;set;}
    public List<int>? StudentCourseIds {get;set;}


    // Professor
    public int? ShiftId {get;set;}
    public DateOnly? ContractDate {get;set;}
    public List<int>? ProfessorCourseIds {get;set;}
}

public class StudentInfoDto
{
    public DateOnly BirthDate {get;set;}

    public List<CourseListDto> Courses {get;set;} = [];
}

public class ProfessorInfoDto
{
    public int Id { get; set; }

    public DateOnly ContractDate {get;set;}

    public int ShiftId {get;set;}

    public bool IsActive {get;set;}

    public List<CourseListDto> Courses {get;set;} = [];
}

public class NotificationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Link { get; set; }
}

public class ProfessorSummaryDto
{
    public int TotalCourses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalActivities { get; set; }
    public int PendingSubmissionsToGrade { get; set; }
    public List<ProfessorTopCourseDto> TopCourses { get; set; } = [];
}

public class ProfessorTopCourseDto
{
    public int CourseId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int EnrolledStudentsCount { get; set; }
}
