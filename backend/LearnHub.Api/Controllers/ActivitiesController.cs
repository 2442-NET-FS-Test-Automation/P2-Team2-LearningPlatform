using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityRepo _repo;
    public ActivitiesController(IActivityRepo repo) => _repo = repo;


    [HttpGet]
    public async Task<ActionResult<List<ActivitySummaryDto>>> GetAll([FromQuery] int? courseId)
    {

        var activities = courseId.HasValue
            ? await _repo.GetByCourseAsync(courseId.Value)
            : await _repo.GetAllAsync();

        var result = activities.Select(a => new ActivitySummaryDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            DueDate = a.DueDate,
            CreatedAt = a.CreatedAt,
            CourseName = a.Course.Name,
            CreatedBy = a.CreatedBy.FirstName + " " + a.CreatedBy.LastName,
            SubmissionsCount = a.Submissions.Count
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDetailDto>> GetById(int id)
    {
        var activity = await _repo.GetByIdAsync(id);
        if (activity is null) return NotFound();

        var result = new ActivityDetailDto
        {
            Id = activity.Id,
            Title = activity.Title,
            Description = activity.Description,
            DueDate = activity.DueDate,
            CreatedAt = activity.CreatedAt,
            CourseName = activity.Course.Name,
            CreatedBy = activity.CreatedBy.FirstName + " " + activity.CreatedBy.LastName,
            Submissions = activity.Submissions.Select(s => new ActivitySubmissionDto
            {
                Id = s.Id,
                StudentName = s.Student.User.FirstName + " " + s.Student.User.LastName,
                File = s.File,
                Feedback = s.Feedback,
                SubmittedAt = s.SubmittedAt,
                GradedAt = s.GradedAt,
                Score = s.Score
            }).ToList()
        };

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ActivitySummaryDto>> Create([FromBody] CreateActivityDto dto)
    {

        var activity = new Activity
        {
            CourseId = dto.CourseId,
            CreatedByUserId = 1,
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            IsActive = true
        };

        var created = await _repo.CreateAsync(activity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _repo.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpPost("{id}/submissions")]
    public async Task<IActionResult> Submit(int id, [FromBody] CreateSubmissionDto dto)
    {
        var activity = await _repo.GetByIdAsync(id);
        if (activity is null || !activity.IsActive) return NotFound();

        int studentId = 1;

        var existing = await _repo.GetSubmissionAsync(id, studentId);
        if (existing is not null) return Conflict("Already submitted");

        var submission = new ActivitySubmission
        {
            ActivityId = id,
            StudentId = studentId,
            File = dto.File
        };

        await _repo.CreateSubmissionAsync(submission);
        return Created();
    }

    [HttpPatch("submissions/{submissionId}/grade")]
    public async Task<IActionResult> Grade(int submissionId, [FromBody] GradeSubmissionDto dto)
    {
        var success = await _repo.GradeSubmissionAsync(submissionId, dto.Feedback, dto.Score);
        return success ? NoContent() : NotFound();
    }
}