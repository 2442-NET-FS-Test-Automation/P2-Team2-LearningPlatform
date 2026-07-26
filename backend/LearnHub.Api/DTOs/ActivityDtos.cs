// Lo que se devuelve al listar actividades
public record ActivitySummaryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CourseName { get; set; } = default!;
    public string CreatedBy { get; set; } = default!;
    public int SubmissionsCount { get; set; } 
}


public record ActivityDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CourseName { get; set; } = default!;
    public string CreatedBy { get; set; } = default!;
    public List<ActivitySubmissionDto> Submissions { get; set; } = [];
}

// Para crear/editar actividad
public record CreateActivityDto
{
    public int CourseId { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime DueDate { get; set; }
}

// Lo que ve el estudiante de su propia entrega
public record ActivitySubmissionDto
{
    public int Id { get; set; }
    public string StudentName { get; set; } = default!;
    public string? File { get; set; }
    public decimal? Score { get; set; }
    public string? Feedback { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? GradedAt { get; set; }
}

// Para que el estudiante entregue
public record CreateSubmissionDto
{
    public string? File { get; set; }
}

// Para que el profesor califique
public record GradeSubmissionDto
{
    public string Feedback { get; set; } = default!;
    public decimal Score { get; set; }  
}