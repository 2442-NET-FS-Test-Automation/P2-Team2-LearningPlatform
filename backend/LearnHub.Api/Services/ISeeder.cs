

namespace LearnHub.Api.Services;

public interface ISeeder {
    Task<string?> SeedAsync();
}