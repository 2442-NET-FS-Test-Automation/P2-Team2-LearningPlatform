using LearnHub.Data;

namespace LearnHub.Api.Services;

public interface ITokenService 
{
    string Issue(string user, UserRoles role);
}