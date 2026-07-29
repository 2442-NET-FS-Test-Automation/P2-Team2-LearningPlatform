using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnHub.Data.Repositories;

public class NotificationsRepo : INotificationsRepo
{
    private readonly LearnHubDbContext _context;

    public NotificationsRepo(LearnHubDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<Notification>> GetUserNotificationsAsync(int userId, bool unreadOnly = false, int page = 1, int pageSize = 10)
    {
        var query = _context.Notifications.Where(n => n.UserId == userId);
        
        if (unreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(n => n.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        return new PagedResult<Notification>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<Notification?> GetByIdAsync(int id)
    {
        return await _context.Notifications.FindAsync(id);
    }

    public async Task AddNotificationAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }

    public async Task AddNotificationsAsync(IEnumerable<Notification> notifications)
    {
        _context.Notifications.AddRange(notifications);
        await _context.SaveChangesAsync();
    }

    public async Task MarkAsReadAsync(int id)
    {
        var notification = await GetByIdAsync(id);
        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
    }
}
