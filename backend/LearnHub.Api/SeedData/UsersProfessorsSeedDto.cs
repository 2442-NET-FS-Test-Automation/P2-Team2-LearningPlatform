
namespace LearnHub.Api.SeedData;

public class UserProfessorsSeedDto {
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? Bio { get; set; }
    public string Role { get; set; } = default!;

    // Professor fields
    public string? ShiftName { get; set; }
    public DateOnly? ContractDate { get; set; }
    public bool? IsActive { get; set; }

    // Student fields
    public DateOnly? BirthDate { get; set; }
}
