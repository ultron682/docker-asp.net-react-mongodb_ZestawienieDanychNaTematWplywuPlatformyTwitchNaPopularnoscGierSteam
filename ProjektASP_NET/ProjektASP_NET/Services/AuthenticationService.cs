using Microsoft.IdentityModel.Tokens;
using ProjektASP_NET.Interface;
using ProjektASP_NET.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;


namespace ProjektASP_NET.Services
{
    public interface IAuthenticationService
    {
        Task<User> RegisterAsync(RegisterModel model);
        Task<string> LoginAsync(LoginModel model);
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthenticationService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<User> RegisterAsync(RegisterModel model)
        {
            var existingUser = await _userRepository.GetByEmailAsync(model.Email);
            if (existingUser != null) throw new Exception("Email jest już zajety");

            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Username = model.Username,
                Email = model.Email,
                Password = BC.HashPassword(model.Password)
            };

            return await _userRepository.CreateAsync(user);
        }

        public async Task<string> LoginAsync(LoginModel model)
        {
            var user = await _userRepository.GetByEmailAsync(model.Email);
            if (user == null || !BC.Verify(model.Password, user.Password))
                throw new Exception("Niepoprawny email lub haslo");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Id) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
