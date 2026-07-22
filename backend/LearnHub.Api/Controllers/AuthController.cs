using LearnHub.Api.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;
using LearnHub.Api.Services;
using LearnHub.Data;
using LearnHub.Data.Entities;
using System.Security.Claims;
using Serilog;

namespace LearnHub.Api.Controllers;

// TODO: return a user DTO PasswordHash MUST NOT be returned to the client
// TODO: Make this use a repo


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase {
    private readonly IUserService _users;
    private readonly ITokenService _tokens;

    public AuthController(IUserService users, ITokenService tokens)
    {
        _users = users;
        _tokens = tokens;
    }

    // -- Register user --
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterUserDto dto)
    {
        var error = await _users.RegisterUserAsync(
            dto.Username,
            dto.FirstName, 
            dto.LastName,
            dto.Email,
            dto.Bio ?? "",
            dto.BirthDate,
            dto.Password
        );

        if(error is not null)
        {
            return Conflict(new { error });
        }

        // -- Issue token --
        var token = _tokens.Issue(dto.Username, UserRoles.Student);

        var user = await _users.LoginUserAsync(dto.Username, dto.Password);

        var publicUser = ToPublicUser(user!);

        return Ok(new {
            user = publicUser,
            token 
        });
    }

    // -- Login user --
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginUserDto dto)
    {
        var user = await _users.LoginUserAsync(dto.EmailOrUsername, dto.Password);

        if(user is null)
        {
            return Unauthorized(new {
                error = "Invalid credentials",
            });
        }

        var token = _tokens.Issue(user.Username, user.Role);

        return Ok(new {
            user,
            token
        });
    }

    [HttpGet("me")]
    public ActionResult Me()
    {
        var userFound = User.Identity?.Name == null ? null : _users.GetUserByUsernameAsync(User.Identity.Name);
        return Ok(new
        {
            user = userFound,
            role = User.FindFirstValue(ClaimTypes.Role)
        });
    }




    // -- Helper methods --
    private static UserDto ToPublicUser(User user)
    {
        return new UserDto(
            user.Id.ToString(),
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Bio ?? "",
            user.Role.ToString()
        );
    }
}