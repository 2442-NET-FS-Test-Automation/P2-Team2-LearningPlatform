using LearnHub.Data.Tools;

namespace LearnHub.Data.Repositories;

public interface IReportRepo
{
    Task<AdminReportModel> GetGeneralReportAsync();
}
