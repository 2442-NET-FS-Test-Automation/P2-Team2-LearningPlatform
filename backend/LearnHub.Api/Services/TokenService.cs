using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


namespace LearnHub.Api.Services;

public class TokenService : ITokenService
{

    private readonly string? _key;

    public TokenService(IConfiguration config)
    {
        _key = config["Jwt:key"];
    }






    public string Issue(string user, string role)
    {
         var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key!)), SecurityAlgorithms.HmacSha256
        );


        var token = new JwtSecurityToken(
            "leanrhub",
            "learnhub-clients",
            new[] {
                new Claim(ClaimTypes.Name, user),
                new Claim(ClaimTypes.Role, role)
            },
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );


        return new JwtSecurityTokenHandler().WriteToken(token);
        
    }
}