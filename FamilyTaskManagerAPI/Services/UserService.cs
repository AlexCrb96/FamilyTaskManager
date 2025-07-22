using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.Entities;
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

        public UserService(UserRepository repo, UserValidator userValidator)
        {
            _repo = repo;
            
            _userValidator = userValidator;
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

        internal async Task<User> LoginUserAsync(User input, string password)
        {
            // Check if the user exists
            var user = await _userValidator.ValidateAndGetUserByEmail(input.Email);

            // Verify the password
            await _userValidator.ValidateUserPassword(user, password);

            return user;
        }
    }
}
