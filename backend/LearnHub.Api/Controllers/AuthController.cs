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


        //set cookie
        Response.Cookies.Append(
            "access-token",
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(1)
            }
        );





        var user = await _users.LoginUserAsync(dto.Username, dto.Password);

        var publicUser = ToPublicUser(user!);

        return Ok(new {
            user = publicUser
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

        if (!user.IsActive) return Forbid();

        var token = _tokens.Issue(user.Username, user.Role);

        //set cookie
        Response.Cookies.Append(
            "access-token",
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(1)
            }
        );


        var publicUser = ToPublicUser(user!);
        return Ok(new {
            user = publicUser
        });
    }



    // -- Logout user
    [HttpPost("logout")]
    public ActionResult Logout()
    {
        Response.Cookies.Delete(
            "access-token",
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            }
        );

        return NoContent();
    }










    [HttpGet("me")]
    public async Task<ActionResult> Me()
    {
        var user = User.Identity?.Name == null ? null : await _users.GetUserByUsernameAsync(User.Identity.Name);
        if (user == null) return Unauthorized();
        
        var publicUser = ToPublicUser(user);

        return Ok(new
        {
            user = publicUser,
            role = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpGet("test-error")]
    public ActionResult TestError()
    {
        // Esto es solo para probar el ExceptionHandlingMiddleware
        throw new ArgumentException("Este es un error provocado intencionalmente para probar el middleware.");
    }

    // -- Helper methods --
    public static UserDto ToPublicUser(User user)
    {
        return new UserDto(
            user.Id,
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Bio ?? "",
            user.Role.ToString()
        );
    }
}