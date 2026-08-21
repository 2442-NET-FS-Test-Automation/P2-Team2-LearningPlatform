

using LearnHub.Api.DTOs.Users;
using LearnHub.Api.Services;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepo _repo;
    private readonly IUserService _service;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokens;

    public UsersController(
        IUserRepo repo,
        IUserService service,
        IMapper mapper,
        ITokenService tokens)
    {
        _repo = repo;
        _service = service;
        _mapper = mapper;
        _tokens = tokens;
    }


    [HttpGet]
    public async Task<ActionResult<PagedResult<UserDto>>> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? fullName = null,
        [FromQuery] UserRoles? role = null,
        [FromQuery] bool? isActive = null
        )
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await _repo.GetAllAsync(
            page,
            pageSize,
            role,
            fullName,
            isActive);

        var response = new PagedResult<UserDto>
        {
            Items = result.Items.Select(u => new UserDto
            {
                Id = u.Id,
                Role = u.Role.ToString(),
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Bio = u.Bio,
                IsActive = u.IsActive
            }).ToList(),

            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        };

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDetailsDto>> GetUser(int id)
    {
        if (!DataTypeVerification.IsNumValid(id))
            return BadRequest();

        var user = await _repo.GetByIdAsync(id);

        if (user is null)
            return NotFound();

        return Ok(_mapper.Map<UserDetailsDto>(user));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        try
        {
            var user = await _service.CreateUserAsync(dto);

            return Ok(new { user = AuthController.ToPublicUser(user!) });
        }
        catch(ArgumentException ex)
        {
            return BadRequest(new
            {
                error = ex.Message
            });
        }
    }

    [HttpPatch("{id:int}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(
        int id,
        UpdateUserDto dto)
    {
        var user = await _repo.GetByIdAsync(id);

        if(user == null) return NotFound();

        var role = User.FindFirstValue(System.Security.Claims.ClaimTypes.Role);
        var username = User.Identity?.Name;
        if (role != "Admin" && user.Username != username) return Forbid();

        try
        {
            user = await _service.UpdateUserAsync(user, dto);

            var token = _tokens.Issue(user!.Username, user.Role);

            return Ok(new { user = AuthController.ToPublicUser(user), token });
        }
        catch(InvalidOperationException ex)
        {
            return BadRequest(new
            {
                error = ex.Message
            });
        }
        catch(ArgumentException ex)
        {
            return BadRequest(new
            {
                error = ex.Message
            });
        }
    }


    [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser (int id)
    {
        if (DataTypeVerification.IsNumValid(id))
        {
            var user = await _repo.GetByIdAsync(id);

            if( user == null) return NotFound();

            await _repo.DeleteAsync(user);
            
            return NoContent();
        }
        return BadRequest();
    }

    [HttpPost("{id:int}/reactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReactivateUser(int id)
    {
        if (DataTypeVerification.IsNumValid(id))
        {
            var user = await _repo.GetByIdAsync(id);

            if (user == null) return NotFound();

            user.IsActive = true;
            await _repo.UpdateAsync(user);
            
            return NoContent();
        }
        return BadRequest();
    }

    [HttpPost("{id}/promote")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PromoteToProfessor(
        int id,
        PromoteProfessorDto dto)
    {
        var success = await _service.PromoteToProfessorAsync(id, dto);

        if (!success)
            return BadRequest();

        return NoContent();
    }
}