using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using LearnHub.Api.DTOs.Reports;

namespace LearnHub.Tests;

public class ReportsControllerTests : IClassFixture<TestApplicationFactory>
{
    private readonly HttpClient _client;

    public ReportsControllerTests(TestApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task TC_Reporting_01_GetGeneralReport_AdminReceivesReportData()
    {
        _client.LoginAsAdmin();

        var response = await _client.GetAsync("/api/Reports/general");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var report = await response.Content.ReadFromJsonAsync<AdminReportDto>();

        report.Should().NotBeNull();
        report!.TotalCourses.Should().BeGreaterThanOrEqualTo(0);
        report.TotalStudents.Should().BeGreaterThanOrEqualTo(0);
        report.TotalEnrollments.Should().BeGreaterThanOrEqualTo(0);
        report.TopCourses.Should().NotBeNull();
        report.TopCourses.Should().HaveCountLessThanOrEqualTo(5);
        report.TopCourses.Should().OnlyContain(course =>
            course.CourseId > 0 &&
            !string.IsNullOrWhiteSpace(course.CourseName) &&
            course.EnrollmentCount >= 0);
    }

    [Theory]
    [InlineData("Student")]
    [InlineData("Professor")]
    public async Task TC_Reporting_02_GetGeneralReport_NonAdminIsForbidden(string role)
    {
        if (role == "Student")
            _client.LoginAsStudent();
        else
            _client.LoginAsProfessor();

        var response = await _client.GetAsync("/api/Reports/general");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
