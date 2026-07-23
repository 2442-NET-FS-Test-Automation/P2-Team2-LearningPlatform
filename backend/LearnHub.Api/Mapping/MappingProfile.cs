using AutoMapper;
using LearnHub.Api.DTOs.Reports;
using LearnHub.Data.Tools;

namespace LearnHub.Api.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<AdminReportModel, AdminReportDto>();
        CreateMap<TopCourseModel, TopCourseDto>();
    }
}
