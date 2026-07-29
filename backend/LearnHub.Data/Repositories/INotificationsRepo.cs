using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface INotificationsRepo
{
    Task<PagedResult<Notification>> GetUserNotificationsAsync(int userId, bool unreadOnly = false, int page = 1, int pageSize = 10);
    Task<Notification?> GetByIdAsync(int id);
    Task AddNotificationAsync(Notification notification);
    Task AddNotificationsAsync(IEnumerable<Notification> notifications);
    Task MarkAsReadAsync(int id);
    Task MarkAllAsReadAsync(int userId);
}
