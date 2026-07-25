using LearnHub.Data.Entities;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ShiftsController(IShiftsRepo repo) : ControllerBase
{
    private readonly IShiftsRepo _repo = repo;
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Shift>>> GetAllShifts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    ) {
        // Set pagination limits
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var shifts = await _repo.GetShiftsAsync();

        return Ok(shifts);
    }
}