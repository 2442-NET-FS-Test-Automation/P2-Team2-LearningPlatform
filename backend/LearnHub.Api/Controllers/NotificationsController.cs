using AutoMapper;
using LearnHub.Api.DTOs.Users;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationsRepo _notificationsRepo;
    private readonly IUserRepo _userRepo;
    private readonly IMapper _mapper;

    public NotificationsController(INotificationsRepo notificationsRepo, IUserRepo userRepo, IMapper mapper)
    {
        _notificationsRepo = notificationsRepo;
        _userRepo = userRepo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<NotificationDto>>> GetUserNotifications(
        [FromQuery] bool unreadOnly = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var user = await _userRepo.GetByEmailOrUsernameAsync(username);
        if (user == null) return Unauthorized();

        var pagedResult = await _notificationsRepo.GetUserNotificationsAsync(user.Id, unreadOnly, page, pageSize);
        
        return Ok(new PagedResult<NotificationDto>
        {
            Items = _mapper.Map<List<NotificationDto>>(pagedResult.Items),
            Page = pagedResult.Page,
            PageSize = pagedResult.PageSize,
            TotalItems = pagedResult.TotalItems,
            TotalPages = pagedResult.TotalPages
        });
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        if (!LearnHub.Data.DataTypeVerification.IsNumValid(id)) return BadRequest();

        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var user = await _userRepo.GetByEmailOrUsernameAsync(username);
        if (user == null) return Unauthorized();

        var notification = await _notificationsRepo.GetByIdAsync(id);
        if (notification == null) return NotFound();

        // Ensure the notification belongs to the current user
        if (notification.UserId != user.Id) return Forbid();

        await _notificationsRepo.MarkAsReadAsync(id);
        return NoContent();
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var user = await _userRepo.GetByEmailOrUsernameAsync(username);
        if (user == null) return Unauthorized();

        await _notificationsRepo.MarkAllAsReadAsync(user.Id);
        return NoContent();
    }
}
