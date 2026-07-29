using AutoMapper;
using LearnHub.Api.DTOs.Courses;
using LearnHub.Api.DTOs.Reports;
using LearnHub.Api.DTOs.Users;
using LearnHub.Data.Entities;
using LearnHub.Data.Tools;

namespace LearnHub.Api.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Reports
        CreateMap<AdminReportModel, AdminReportDto>();
        CreateMap<TopCourseModel, TopCourseDto>();

        CreateMap<User, UserDto>()
            .ForMember(
                dest => dest.Role,
                opt => opt.MapFrom(src => src.Role.ToString())
            );


        CreateMap<User, UserDetailsDto>()
            .ForMember(
                dest => dest.Role,
                opt => opt.MapFrom(src => src.Role.ToString())
            );

        CreateMap<Student, StudentInfoDto>()
            .ForMember(
                dest => dest.Courses,
                opt => opt.MapFrom(src =>
                    src.StudentCourses.Select(sc => sc.Course)
                )
            );

        CreateMap<Professor, ProfessorInfoDto>()
            .ForMember(
                dest => dest.Courses,
                opt => opt.MapFrom(src => src.Courses)
            );

        CreateMap<Course, CourseListDto>()
            .ForMember(
                dest => dest.Category,
                opt => opt.MapFrom(src =>
                    src.CategoryName.ToString()
                )
            );


        CreateMap<Course, CourseDetailDto>()
            .ForMember(
                dest => dest.Category,
                opt => opt.MapFrom(src =>
                    src.CategoryName.ToString()
                )
            )
            .ForMember(
                dest => dest.Price,
                opt => opt.MapFrom(src =>
                    src.EnrollmentPrice
                )
            )
            .ForMember(
                dest => dest.EnrolledStudents,
                opt => opt.MapFrom(src =>
                    src.StudentCourses.Count
                )
            )
            .ForMember(
                dest => dest.Instructor,
                opt => opt.MapFrom(src =>
                    src.Professor != null
                    ? src.Professor.User.FirstName + " " + src.Professor.User.LastName
                    : "No assigned"
                )
            );

        CreateMap<Activity, ActivitySummaryDto>()
            .ForMember(
                dest => dest.CourseName,
                opt => opt.MapFrom(src => src.Course.Name)
            )
            .ForMember(
                dest => dest.CreatedBy,
                opt => opt.MapFrom(src => src.CreatedBy.FirstName + " " + src.CreatedBy.LastName)
            )
            .ForMember(
                dest => dest.SubmissionsCount,
                opt => opt.MapFrom(src => src.Submissions.Count)
            );

        CreateMap<Activity, ActivityDetailDto>()
            .ForMember(
                dest => dest.CourseName,
                opt => opt.MapFrom(src => src.Course.Name)
            )
            .ForMember(
                dest => dest.CreatedBy,
                opt => opt.MapFrom(src => src.CreatedBy.FirstName + " " + src.CreatedBy.LastName)
            )
            .ForMember(
                dest => dest.Submissions, 
                opt => opt.MapFrom(s => s.Submissions));

        CreateMap<ActivitySubmission, ActivitySubmissionDto>()
            .ForMember(
                dest => dest.StudentName,
                opt => opt.MapFrom(src => src.Student.User.FirstName + " " + src.Student.User.LastName)
            );
        CreateMap<Activity, ActivityWithSubmissionDto>()
            .ForMember(d => d.Submission, o => o.MapFrom(s => s.Submissions.FirstOrDefault()));

        CreateMap<CourseSchedule, CourseScheduleDto>();
        CreateMap<Notification, NotificationDto>();
    }
}