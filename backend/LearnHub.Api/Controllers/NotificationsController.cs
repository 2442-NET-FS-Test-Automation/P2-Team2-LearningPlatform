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

    public NotificationsController(INotificationsRepo notificationsRepo, IUserRepo userRepo)
    {
        _notificationsRepo = notificationsRepo;
        _userRepo = userRepo;
    }

    [HttpGet]
    public async Task<ActionResult<List<Notification>>> GetUserNotifications([FromQuery] bool unreadOnly = false)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var user = await _userRepo.GetByEmailOrUsernameAsync(username);
        if (user == null) return Unauthorized();

        var notifications = await _notificationsRepo.GetUserNotificationsAsync(user.Id, unreadOnly);
        return Ok(notifications);
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
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
