using LearnHub.Api.DTOs.Users;
using LearnHub.Data.Entities;

namespace LearnHub.Api.Services;

public interface IUserService {
    Task<string?> RegisterUserAsync (
        string username,
        string firstName,
        string lastName,
        string email,
        string bio,
        string birthDate,
        string password
    ); 
    Task<User?> CreateUserAsync(CreateUserDto dto);
    Task<User?> LoginUserAsync(string email, string password);
    Task<User?> GetUserByUsernameAsync(string username);
}