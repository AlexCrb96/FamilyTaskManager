using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Services
{
    public class UserService
    {
        private readonly TaskManagerDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(TaskManagerDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<string> RegisterUserAsync(User input, string password)
        {
            // Check if user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == input.Email);
            if (existingUser != null)
            {
                throw new ValidationException("User e-mail is already registered.");
            }

            // Hash the password
            input.PasswordHash = _passwordHasher.HashPassword(input, password);

            // Add to context and save changes
            _context.Users.Add(input);
            await _context.SaveChangesAsync();
            return input.Id;
        }

        internal async Task<User> LoginUserAsync(User input, string password)
        {
            // Check if the user exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == input.Email);
            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            // Verify the password
            var result = _passwordHasher.VerifyHashedPassword(existingUser, existingUser.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new ValidationException("Invalid password.");
            }

            return existingUser;
        }
    }
}
