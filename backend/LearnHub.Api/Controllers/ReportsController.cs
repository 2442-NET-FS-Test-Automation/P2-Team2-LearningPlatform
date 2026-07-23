using LearnHub.Data.Dtos.Reports;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly IReportRepo _reportRepo;

    public ReportsController(IReportRepo reportRepo)
    {
        _reportRepo = reportRepo;
    }

    [HttpGet("general")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AdminReportDto>> GetGeneralReport()
    {
        var report = await _reportRepo.GetGeneralReportAsync();
        return Ok(report);
    }
}
