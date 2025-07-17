using FamilyTaskManagerAPI.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FamilyTaskManagerAPI.Utils
{
    public class JwtProvider
    {
        private readonly IConfiguration _configuration;
        private DateTime _now = DateTime.UtcNow;
        public JwtProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]);
            return new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
        }

        private string GenerateToken(IEnumerable<Claim> claims, DateTime expires)
        {
            var credentials = GetSigningCredentials();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                NotBefore = _now,
                Expires = expires,
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string GenerateAuthToken(User user)
        {

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var expires = _now.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpiresInMinutes"]));

            return GenerateToken(claims, expires);
        }
    }
}
