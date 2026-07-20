namespace LearnHub.Api.Services;

public interface ITokenService 
{
    string Issue(string user, string role);
}