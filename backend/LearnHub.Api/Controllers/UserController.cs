

using LearnHub.Api.DTOs.Users;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserRepo _repo;

    public UserController(IUserRepo repo)
    {
        _repo = repo;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
        [FromQuery] UserRoles? role,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await _repo.GetAllAsync(page, pageSize, role);

        var response = new PagedResult<UserDto>
        {
            Items = result.Items.Select(u => new UserDto
            {
                Id = u.Id,
                Role = u.Role,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Bio = u.Bio
            }).ToList(),
            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        };

        return Ok(response);
    }

    public async Task<ActionResult<IEnumerable<UserDto>>> SearchUsersByFullName(
        [FromQuery] string FullName,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;
        if(!DataTypeVerification.IsStringValid(FullName)) return BadRequest();

        var users = await _repo.SearchByFullNameAsync(FullName , page , pageSize);

        var response = users.Items.Select(u => new UserDto
        {
            Id = u.Id,
            Role = u.Role,
            Username = u.Username,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            Bio = u.Bio
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        if (!DataTypeVerification.IsNumValid(id)) return BadRequest();

        var user = await _repo.GetByIdAsync(id);

        if(user == null) return NotFound();

        var dto = new UserDto
        {
            Id = user.Id,
            Role = user.Role,
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Bio = user.Bio
        };

        return Ok(dto);
    }


    

}