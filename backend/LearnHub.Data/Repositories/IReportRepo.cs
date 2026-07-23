using LearnHub.Data.Entities;

namespace LearnHub.Data.Repositories;

public interface IReportRepo
{
    Task<AdminReportModel> GetGeneralReportAsync();
}
