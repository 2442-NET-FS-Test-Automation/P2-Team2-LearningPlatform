using System.Security.Claims;
using AutoMapper;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityRepo _repo;
    private readonly IUserRepo _userRepo;
    private readonly IMapper _mapper;

    public ActivitiesController(IActivityRepo repo, IMapper mapper, IUserRepo userRepo)
    {
        _repo = repo;
        _mapper = mapper;
        _userRepo = userRepo;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PagedResult<ActivitySummaryDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? courseId = null
    )
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await _repo.GetAllAsync(page, pageSize, courseId);

        return Ok(new PagedResult<ActivitySummaryDto>
        {
            Items = _mapper.Map<List<ActivitySummaryDto>>(result.Items),
            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        });
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ActivityDetailDto>> GetById(int id)
    {
        if (!DataTypeVerification.IsNumValid(id)) return BadRequest();

        var activity = await _repo.GetByIdAsync(id);
        if (activity is null) return NotFound();

        return Ok(_mapper.Map<ActivityDetailDto>(activity));
    }

    [HttpGet("course/{courseId:int}")]
    [Authorize(Roles = "Professor,Student,Admin")]
    public async Task<ActionResult<PagedResult<ActivitySummaryDto>>> GetByCourse(
        int courseId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        if (!DataTypeVerification.IsNumValid(courseId)) return BadRequest();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var username = User.Identity?.Name;
        var role = User.FindFirstValue(ClaimTypes.Role);

        var hasAccess = role switch
        {
            "Admin" => true,
            "Professor" => await _repo.ProfessorTeachesCourseAsync(username!, courseId),
            "Student"   => await _repo.StudentEnrolledInCourseAsync(username!, courseId),
            _           => false
        };

        if (!hasAccess) return Forbid();

        var result = await _repo.GetByCourseAsync(courseId, page, pageSize);

        return Ok(new PagedResult<ActivitySummaryDto>
        {
            Items = _mapper.Map<List<ActivitySummaryDto>>(result.Items),
            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<ActionResult<ActivitySummaryDto>> Create([FromBody] CreateActivityDto dto)
    {
        if (!DataTypeVerification.IsNumValid(dto.CourseId)) return BadRequest();

        var username = User.Identity?.Name;
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "Professor")
        {
            var teaches = await _repo.ProfessorTeachesCourseAsync(username!, dto.CourseId);
            if (!teaches) return Forbid();
        }

        var user = await _userRepo.GetByEmailOrUsernameAsync(username!);

        var activity = new Activity
        {
            CourseId = dto.CourseId,
            CreatedByUserId = user!.Id,
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            IsActive = true
        };

        var created = await _repo.CreateAsync(activity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, _mapper.Map<ActivitySummaryDto>(created));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!DataTypeVerification.IsNumValid(id)) return BadRequest();

        var activity = await _repo.GetByIdAsync(id);
        if (activity is null) return NotFound();

        var username = User.Identity?.Name;
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "Professor")
        {
            var teaches = await _repo.ProfessorTeachesCourseAsync(username!, activity.CourseId);
            if (!teaches) return Forbid();
        }

        await _repo.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id:int}/submissions")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Submit(int id, [FromBody] CreateSubmissionDto dto)
    {
        if (!DataTypeVerification.IsNumValid(id)) return BadRequest();

        var activity = await _repo.GetByIdAsync(id);
        if (activity is null || !activity.IsActive) return NotFound();

        var username = User.Identity?.Name;

        var enrolled = await _repo.StudentEnrolledInCourseAsync(username!, activity.CourseId);
        if (!enrolled) return Forbid();

        var studentId = await _repo.GetStudentIdByUsernameAsync(username!);

        var existing = await _repo.GetSubmissionAsync(id, studentId);
        if (existing is not null) return Conflict(new { error = "Already submitted" });

        var submission = new ActivitySubmission
        {
            ActivityId = id,
            StudentId = studentId,
            File = dto.File
        };

        await _repo.CreateSubmissionAsync(submission);
        return Created();
    }
    
    [HttpPatch("submissions/{submissionId:int}/grade")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Grade(int submissionId, [FromBody] GradeSubmissionDto dto)
    {
        if (!DataTypeVerification.IsNumValid(submissionId)) return BadRequest();

        var success = await _repo.GradeSubmissionAsync(submissionId, dto.Feedback, dto.Score);
        return success ? NoContent() : NotFound();
    }
}