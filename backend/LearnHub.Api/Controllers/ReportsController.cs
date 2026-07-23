using AutoMapper;
using LearnHub.Api.DTOs.Reports;
using LearnHub.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnHub.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly IReportRepo _reportRepo;
    private readonly IMapper _mapper;

    public ReportsController(IReportRepo reportRepo, IMapper mapper)
    {
        _reportRepo = reportRepo;
        _mapper = mapper;
    }

    [HttpGet("general")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AdminReportDto>> GetGeneralReport()
    {
        var model = await _reportRepo.GetGeneralReportAsync();
        
        var dto = _mapper.Map<AdminReportDto>(model);

        return Ok(dto);
    }
}
