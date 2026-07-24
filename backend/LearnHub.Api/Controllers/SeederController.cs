using LearnHub.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/[controller]")]


public class SeederController : ControllerBase {
    private readonly ISeeder _seeder;


    public SeederController(ISeeder seeder)
    {
        _seeder = seeder;
    }

    [HttpPost("seed")]
    public async Task<ActionResult<string?>> Seed()
    {
        var result = await _seeder.SeedAsync();

        if(result is not null)
            return BadRequest(new {
                message = "Seed failed",
                error = result
            });

        return Ok(new {
            message = "Seed completed"
        });
    }




}
