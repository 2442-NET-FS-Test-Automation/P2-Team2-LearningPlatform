using LearnHub.Api.DTOs.Users;
using LearnHub.Data.Entities;
using Microsoft.AspNetCore.Mvc;

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
    Task<User?> UpdateUserAsync(User user,UpdateUserDto dto);
    Task<bool> UpdateStudentCoursesAsync(int studentId,List<int> courseIds);
    Task<bool> UpdateProfessorCoursesAsync(int professorId,List<int> courseIds);
}