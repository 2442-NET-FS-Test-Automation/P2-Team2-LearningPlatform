using AutoMapper;
using LearnHub.Data;
using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ShiftsController(IShiftsRepo repo) : ControllerBase
{
    private readonly IShiftsRepo _repo = repo;

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Shift>>> GetAllShifts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    ) {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var result = await _repo.GetShiftsAsync(page, pageSize);

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
    [Authorize]
    public async Task<ActionResult<Shift>> AddShift(
        [FromQuery] string name,
        [FromQuery] string startTime,
        [FromQuery] string endTime
    )
    {
        try
        {
            var shift = await _repo.AddAsync(new Shift{Name=name, StartTime=TimeOnly.Parse(startTime), EndTime= TimeOnly.Parse(endTime)});

            return Ok( shift );
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
    [Authorize]
    public async Task<ActionResult<Shift>> UpdateShift(
        int id,
        [FromQuery] string name,
        [FromQuery] string startTime,
        [FromQuery] string endTime)
    {
        // try
        // {
        //     await _repo.UpdateAsync(new Shift { Name = Name, StartTime = TimeOnly.Parse(StartTime), EndTime = TimeOnly.Parse(EndTime) });

        //     return Ok();
        // }
        // catch (Exception ex)
        // {
        //     return BadRequest(new
        //     {
        //         error = ex.Message
        //     });
        // }
        return Ok();
    }
}

public class ShiftDto{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string StartTime { get; set; } = default!;
    public string EndTime { get; set; } = default!;
};