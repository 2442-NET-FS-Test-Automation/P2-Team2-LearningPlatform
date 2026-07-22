using LearnHub.Data.Entities;

namespace LearnHub.Api.DTOs.Professors;

public class ProfessorDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Username { get; set; } = default!;

    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public int ShiftId { get; set; }

    public DateOnly ContractDate { get; set; }

    public bool IsActive { get; set; }
}

public class CreateProfessorDto
{
    // User information
    public string Username { get; set; } = default!;

    public string Password { get; set; } = default!;

    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string? Bio { get; set; }


    // Professor information
    public int ShiftId { get; set; }

    public DateOnly ContractDate { get; set; }
}

public class UpdateProfessorDto
{
    public int? ShiftId { get; set; }

    public DateOnly? ContractDate { get; set; }

    public bool? IsActive { get; set; }
}