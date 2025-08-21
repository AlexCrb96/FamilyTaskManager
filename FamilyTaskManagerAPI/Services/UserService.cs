using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Utils;
using FamilyTaskManagerAPI.Validators;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Services
{
    public class UserService
    {
        private readonly UserRepository _repo;
        private readonly UserValidator _userValidator;
        private readonly MailService _mailService;
        private readonly JwtProvider _jwtProvider;

        public UserService(UserRepository repo, UserValidator userValidator, MailService mailService, JwtProvider jwtProvider)
        {
            _repo = repo;
            _userValidator = userValidator;
            _mailService = mailService;
            _jwtProvider = jwtProvider;
        }

        public async Task<string> RegisterUserAsync(User input, string password)
        {
            // Check if user already exists
            await _userValidator.ValidateEmailIsUnique(input.Email);

            // Hash the password
            input.PasswordHash = _userValidator.HashPassword(input, password);

            // Add to context and save changes
            await _repo.AddAsync(input);
            await _repo.SaveAsync();
            return input.Id;
        }

        public async Task<User> LoginUserAsync(User input, string password)
        {
            // Check if the user exists
            var user = await _userValidator.ValidateAndGetUserByEmail(input.Email);

            // Verify the password
            await _userValidator.ValidateUserPassword(user, password);

            return user;
        }

        public string GenerateLoginToken(User user)
        {
            // Generate JWT token for the user
            return _jwtProvider.GenerateAuthToken(user);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task SendPasswordResetEmail(string toEmail)
        {
            // Check if the user exists
            var user = await _userValidator.ValidateAndGetUserByEmail(toEmail);

            GeneratePasswordResetToken(user);
            _repo.Update(user);
            await _repo.SaveAsync();

            string resetLink = $"https://localhost:7003/api/users/reset-password?token={user.PasswordResetToken}";

            _mailService.SendEmail(
                toEmail,
                "Password Reset Request",
                $"Click here to reset your password: {resetLink}"
            );
        }

        public async Task ResetUserPasswordAsync(string token, string newPassword)
        {
            var user = await _userValidator.ValidateAndGetUserByToken(token);

            user.PasswordHash = _userValidator.HashPassword(user, newPassword);
            ClearPasswordResetToken(user);

            _repo.Update(user);
            await _repo.SaveAsync();
        }

        private void GeneratePasswordResetToken(User user)
        {
            // Generate a password reset token
            user.PasswordResetToken = Guid.NewGuid().ToString();
            user.PasswordResetTokenExpiration = DateTime.UtcNow.AddHours(1);
        }

        private void ClearPasswordResetToken(User user)
        {
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiration = null;
        }
    }
}
