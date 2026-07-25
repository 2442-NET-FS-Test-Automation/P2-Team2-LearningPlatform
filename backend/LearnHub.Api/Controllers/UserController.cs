

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
public class UserController : ControllerBase
{
    private readonly IUserRepo _repo;
    private readonly IUserService _service;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokens;

    public UserController(
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
        [FromQuery] UserRoles? role = null
        )
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await _repo.GetAllAsync(
            page,
            pageSize,
            role,
            fullName);

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
                Bio = u.Bio
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

            return Ok(user);
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
    public async Task<IActionResult> UpdateUser(
        int id,
        UpdateUserDto dto)
    {
        var user = await _repo.GetByIdAsync(id);

        if(user == null) return NotFound();

        try
        {
            user = await _service.UpdateUserAsync(user, dto);

            var token = _tokens.Issue(user!.Username, user.Role);

            return Ok(new { user = AuthController.ToPublicUser(user), token });
        }
        catch (Exception e)
        {
            return Conflict(error: e.Message);
        }
    }
}