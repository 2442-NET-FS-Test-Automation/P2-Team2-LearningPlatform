using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using LearnHub.Data;


namespace LearnHub.Api.Services;

public class TokenService : ITokenService
{
    private readonly string? _key;

    public TokenService(IConfiguration config)
    {
        _key = config["Jwt:key"];
    }

    public string Issue(string username, UserRoles role)
    {
         var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key!)), SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            "learnhub",
            "learnhub-clients",
            new[] {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role.ToString())
            },
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
        
    }
}