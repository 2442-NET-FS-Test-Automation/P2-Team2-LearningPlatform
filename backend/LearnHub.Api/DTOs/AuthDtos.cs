using System.ComponentModel.DataAnnotations;

namespace LearnHub.Api.DTOs.Auth;

public record RegisterUserDto(
    // [Required] string Test
    [Required, MaxLength(50), RegularExpression("^[a-zA-Z0-9]+$")] string Username,
    [Required, MaxLength(50)] string FirstName,
    [Required, MaxLength(50)] string LastName,
    [Required, EmailAddress] string Email,
    [MaxLength(400)] string? Bio,
    [Required] string BirthDate,
    [Required, MinLength(8)] string Password
);

public record LoginUserDto(
    [Required] string EmailOrUsername,
    [Required, MinLength(8)] string Password
);


// Client data returns
public record UserDto(
    string Id,
    string Username,
    string FirstName,
    string LastName,
    string Email,
    string Bio,
    string Role
);