namespace LearnHub.Data.Entities;

public class Professor
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = default!;
    public int ShiftId { get; set; }
    public Shift Shift { get; set; } = default!;
    public DateOnly ContractDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
    public bool IsActive { get; set; } = true;
}