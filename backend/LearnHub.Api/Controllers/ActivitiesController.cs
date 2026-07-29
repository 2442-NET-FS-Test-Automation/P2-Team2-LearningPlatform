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
    private readonly INotificationsRepo _notificationsRepo;
    private readonly ICourseRepo _courseRepo;

    public ActivitiesController(IActivityRepo repo, IMapper mapper, IUserRepo userRepo, INotificationsRepo notificationsRepo, ICourseRepo courseRepo)
    {
        _repo = repo;
        _mapper = mapper;
        _userRepo = userRepo;
        _notificationsRepo = notificationsRepo;
        _courseRepo = courseRepo;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Professor")]
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

        var username = User.Identity?.Name;
        var role = User.FindFirstValue(ClaimTypes.Role);

        var hasAccess = role switch
        {
            "Admin" => true,
            "Professor" => await _repo.ProfessorTeachesCourseAsync(username!, activity.CourseId),
            "Student" => await _repo.StudentEnrolledInCourseAsync(username!, activity.CourseId),
            _ => false
        };
        if (!hasAccess) return Forbid();

        var dto = _mapper.Map<ActivityDetailDto>(activity);

        // Students shouldn't see classmates' submissions — trim to just their own
        if (role == "Student")
        {
            var studentId = await _repo.GetStudentIdByUsernameAsync(username!);
            dto.Submissions = dto.Submissions.Where(s => s.StudentId == studentId).ToList();
        }

        return Ok(dto);
    }

    [HttpGet("course/{courseId:int}")]
    [Authorize(Roles = "Professor,Student,Admin")]
    public async Task<ActionResult<PagedResult<ActivitySummaryDto>>> GetByCourse(
        int courseId,
        [FromQuery] bool? isActive = null,
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

        if (role == "Student")
        {
            var studentId = await _repo.GetStudentIdByUsernameAsync(username!);
            var res = await _repo.GetByCourseWithStudentSubmissionAsync(courseId, studentId, page, pageSize);

            return Ok(new PagedResult<ActivityWithSubmissionDto>
            {
                Items = _mapper.Map<List<ActivityWithSubmissionDto>>(res.Items),
                Page = res.Page,
                PageSize = res.PageSize,
                TotalItems = res.TotalItems,
                TotalPages = res.TotalPages
            });
        }
        var result = await _repo.GetByCourseAsync(courseId, isActive ,page, pageSize);

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

        if (dto.DueDate <= DateTime.UtcNow) return BadRequest(new { error = "Due date must be in the future" });

        if (!await _repo.CourseExistsAsync(dto.CourseId))return NotFound(new { error = "Course not found" });

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

        var studentUserIds = await _courseRepo.GetEnrolledUserIdsAsync(dto.CourseId);
        var notifications = studentUserIds.Select(sid => new Notification 
        {
            UserId = sid,
            Message = $"New activity published: {activity.Title}",
            CreatedAt = DateTime.UtcNow,
            Link = $"/courses/{dto.CourseId}"
        });
        await _notificationsRepo.AddNotificationsAsync(notifications);

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

    [HttpPatch("{id:int}/reactivate")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Reactivate(int id)
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

        await _repo.ReactivateAsync(id);
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

        var profUserId = await _courseRepo.GetProfessorUserIdByCourseAsync(activity.CourseId);
        if (profUserId.HasValue) 
        {
            var studentUser = await _userRepo.GetByEmailOrUsernameAsync(username!);
            var studentName = studentUser != null ? studentUser.FirstName : "A student";
            await _notificationsRepo.AddNotificationAsync(new Notification
            {
                UserId = profUserId.Value,
                Message = $"New submission from {studentName} for activity '{activity.Title}'",
                CreatedAt = DateTime.UtcNow,
                Link = $"/courses/{activity.CourseId}"
            });
        }

        return Created();
    }
    
    [HttpPatch("submissions/{submissionId:int}/grade")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Grade(int submissionId, [FromBody] GradeSubmissionDto dto)
    {
        if (!DataTypeVerification.IsNumValid(submissionId)) return BadRequest();

        var success = await _repo.GradeSubmissionAsync(submissionId, dto.Feedback, dto.Score);
        
        if (success) 
        {
            var studentUserId = await _repo.GetUserIdBySubmissionAsync(submissionId);
            if (studentUserId.HasValue) 
            {
                var courseId = await _repo.GetCourseIdBySubmissionAsync(submissionId);
                await _notificationsRepo.AddNotificationAsync(new Notification
                {
                    UserId = studentUserId.Value,
                    Message = $"Your submission was graded: {dto.Score}",
                    CreatedAt = DateTime.UtcNow,
                    Link = courseId.HasValue ? $"/courses/{courseId.Value}" : null
                });
            }
            return NoContent();
        }

        return NotFound();
    }
}