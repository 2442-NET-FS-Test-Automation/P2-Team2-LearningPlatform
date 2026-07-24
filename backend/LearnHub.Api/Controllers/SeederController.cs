using LearnHub.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;


[ApiController]
[Route("api/")]


public class SeederController : ControllerBase {
    private readonly ISeeder _seeder;


    public SeederController(ISeeder seeder)
    {
        _seeder = seeder;
    }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        await _seeder.SeedAsync();
        return Ok(new {
            message = "Seed completed"
        });
    }




}