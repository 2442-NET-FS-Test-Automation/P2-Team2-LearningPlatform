using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using LearnHub.Api.DTOs;
using LearnHub.Data;
using LearnHub.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace LearnHub.Tests;

public class ShiftControllerTests : IClassFixture<TestApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly LearnHubDbContext _context;
    private IDbContextTransaction? _transaction;

    public ShiftControllerTests(TestApplicationFactory factory)
    {
        _client = factory.CreateClient();
        var scope = factory.Services.CreateScope();
        _context = scope.ServiceProvider.GetRequiredService<LearnHubDbContext>();
    }

    [Fact]
    public async Task TC_Scheduling_01_CreateShift_AdminCanCreateValidShift()
    {
        _client.LoginAsAdmin();
        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var dto = new ShiftDto
            {
                Name = $"Weekend-{Guid.NewGuid():N}",
                StartTime = "09:00",
                EndTime = "13:00"
            };

            var response = await _client.PostAsJsonAsync("/api/Shifts", dto);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var created = await response.Content.ReadFromJsonAsync<Shift>();
            created.Should().NotBeNull();
            created!.Name.Should().Be(dto.Name);
            created.StartTime.Should().Be(new TimeOnly(9, 0));
            created.EndTime.Should().Be(new TimeOnly(13, 0));

            (await _context.Shifts.AsNoTracking()
                .AnyAsync(s => s.Id == created.Id && s.Name == dto.Name))
                .Should().BeTrue();
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    [Fact]
    public async Task TC_Scheduling_02_UpdateShift_AdminCanUpdateShiftInformation()
    {
        _client.LoginAsAdmin();
        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var shift = await _context.Shifts.AsNoTracking().FirstAsync();
            var dto = new ShiftDto
            {
                Name = $"Updated-{Guid.NewGuid():N}",
                StartTime = "10:00",
                EndTime = "15:00"
            };

            var response = await _client.PatchAsJsonAsync($"/api/Shifts/{shift.Id}", dto);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updated = await _context.Shifts.AsNoTracking()
                .SingleAsync(s => s.Id == shift.Id);
            updated.Name.Should().Be(dto.Name);
            updated.StartTime.Should().Be(new TimeOnly(10, 0));
            updated.EndTime.Should().Be(new TimeOnly(15, 0));
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }

    [Fact]
    public async Task TC_Scheduling_03_CreateShift_EndBeforeStartIsRejected()
    {
        _client.LoginAsAdmin();
        _transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var name = $"Invalid-{Guid.NewGuid():N}";
            var response = await _client.PostAsJsonAsync("/api/Shifts", new ShiftDto
            {
                Name = name,
                StartTime = "18:00",
                EndTime = "17:00"
            });

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            (await _context.Shifts.AsNoTracking().AnyAsync(s => s.Name == name))
                .Should().BeFalse();
        }
        finally
        {
            await _transaction.RollbackAsync();
        }
    }
}
