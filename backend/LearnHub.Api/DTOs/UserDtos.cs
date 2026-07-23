using System.ComponentModel.DataAnnotations;
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
    public UserRoles? Role { get; set; }

    public string? Username { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Bio { get; set; }

    public string? Email { get; set; }
}
