using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnHub.Tests;

public class TestAuthHandler
    : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string Scheme = "Test";

    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // No header = Anonymous
        if (!Request.Headers.TryGetValue("X-Test-Role", out var role))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var userId = Request.Headers.TryGetValue("X-Test-UserId", out var id)
            ? id.ToString()
            : "1";

        var username = Request.Headers.TryGetValue("X-Test-Username", out var name)
            ? name.ToString()
            : "testuser";

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, role!)
        };

        var identity = new ClaimsIdentity(claims, Scheme);

        var principal = new ClaimsPrincipal(identity);

        var ticket = new AuthenticationTicket(principal, Scheme);

        return Task.FromResult(
            AuthenticateResult.Success(ticket));
    }
}