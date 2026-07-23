using LearnHub.Data.Dtos.Reports;

namespace LearnHub.Data.Repositories;

public interface IReportRepo
{
    Task<AdminReportDto> GetGeneralReportAsync();
}
