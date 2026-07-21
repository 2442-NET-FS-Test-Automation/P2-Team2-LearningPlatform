using LearnHub.Data;
using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IUserRepo
{
    Task<bool> EmailExistsAsync(string email);
    
    Task<bool> UsernameExistsAsync(string username);
    Task<User> RegisterStudentAsync(Student student);
}