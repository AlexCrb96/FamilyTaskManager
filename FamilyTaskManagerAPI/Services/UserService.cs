using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Services
{
    public class UserService(TaskManagerDbContext context, IPasswordHasher<User> passwordHasher)
    {
        public async Task<string> RegisterUserAsync(User input, string password)
        {
            // Check if user already exists
            var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == input.Email);
            if (existingUser != null)
            {
                throw new ValidationException("User e-mail is already registered.");
            }

            // Hash the password
            input.PasswordHash = passwordHasher.HashPassword(input, password);

            // Add to context and save changes
            context.Users.Add(input);
            await context.SaveChangesAsync();
            return input.Id;
        }

        internal async Task<User> LoginUserAsync(User input, string password)
        {
            // Check if the user exists
            var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == input.Email);
            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            // Verify the password
            // Nice to know/have: asta nu e secure, oferi o informatie sensibila care iti face aplicatia vulnerabila la atacuri de tip brute force
            // Best practice e sa ai un mesaj generic de eroare pentru user si parola gresite, din care sa nu isi dea seama nimeni ce e gresit
            var result = passwordHasher.VerifyHashedPassword(existingUser, existingUser.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new ValidationException("Invalid password.");
            }

            return existingUser;
        }
    }
}
