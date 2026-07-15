using System.ComponentModel.DataAnnotations;

namespace LearnHub.Data.Entities;

public class User
{
    public int Id { get; set; }

    [Required]
    public UserRoles Role { get; set; }

    [Required, MaxLength(50)]
    public string Username { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    
    [Required]
    public string Email { get; set; } = default!;
}