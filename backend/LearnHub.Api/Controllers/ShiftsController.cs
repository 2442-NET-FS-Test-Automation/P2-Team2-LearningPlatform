using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using LearnHub.Api.DTOs;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ShiftsController(IShiftsRepo repo) : ControllerBase
{
    private readonly IShiftsRepo _repo = repo;

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Shift>>> GetAllShifts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null
    )
    {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await _repo.GetShiftsAsync(page, pageSize, search);

        var response = new PagedResult<Shift>
        {
            Items = result.Items,
            Page = result.Page,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        };

        return Ok(response);
    }
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Shift>> AddShift(
        [FromBody] ShiftDto dto
    )
    {
        try
        {
            var startTime = TimeOnly.Parse(dto.StartTime!);
            var endTime = TimeOnly.Parse(dto.EndTime!);
            if (endTime <= startTime)
                return BadRequest(new { error = "Shift end time must be after start time." });

            var shift = await _repo.AddAsync(new Shift { Name = dto.Name!, StartTime = startTime, EndTime = endTime });

            if (shift == null) return Conflict("Shift name is already registered.");

            return Ok(shift);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                error = ex.Message
            });
        }
    }

    [HttpPatch("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Shift>> UpdateShift(
        int id,
        [FromBody] ShiftDto dto
    )
    {
        try
        {
            var shift = await _repo.GetById(id);

            if (shift == null) return BadRequest(new { error = "Shift does not exists" });

            var startTime = dto.StartTime == null ? shift.StartTime : TimeOnly.Parse(dto.StartTime);
            var endTime = dto.EndTime == null ? shift.EndTime : TimeOnly.Parse(dto.EndTime);
            if (endTime <= startTime)
                return BadRequest(new { error = "Shift end time must be after start time." });

            if (dto.Name != null) shift.Name = dto.Name;
            shift.StartTime = startTime;
            shift.EndTime = endTime;

            await _repo.UpdateAsync(shift);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                error = ex.Message
            });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RemoveShift(int id)
    {
        if(await _repo.RemoveById(id))
        {
            return Ok();
        }
        return BadRequest(new { error = "Failed to remove" });
    }
}