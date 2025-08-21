using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.Entities;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Validators
{
    public class UserValidator
    {
        private readonly UserRepository _repo;
        private readonly IPasswordHasher<User> _passwordHasher;
        private const string WrongLoginCredentialsMessage = "Wrong login credentials";

        public UserValidator(UserRepository userRepo, IPasswordHasher<User> passwordHasher)
        {
            _repo = userRepo;
            _passwordHasher = passwordHasher;
        }

        public async Task ValidateUserExists(string userId)
        {
            var exists = await _repo.ExistsAsync(u => u.Id == userId);
            if (!exists)
            {
                throw new KeyNotFoundException($"User with ID {userId} does not exist.");
            }
        }

        public async Task<User> ValidateAndGetUserById(string userId)
        {
            return await _repo.GetByIdAsync(userId) ?? throw new KeyNotFoundException($"User with ID {userId} does not exist");
        }

        public async Task<User> ValidateAndGetUserByEmail(string userEmail)
        {
            return await _repo.GetByEmailAsync(userEmail) ?? throw new KeyNotFoundException(WrongLoginCredentialsMessage);
        }

        public async Task<User> ValidateAndGetUserByToken(string token)
        {
            var user = await _repo.GetByTokenAsync(token);
            if (user == null || user.PasswordResetTokenExpiration < DateTime.UtcNow)
            {
                throw new ValidationException("Invalid or expired password reset token.");
            }

            return user;
        }

        public async Task ValidateUserPassword(User user, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new ValidationException(WrongLoginCredentialsMessage);
            }
        }

        public string HashPassword(User user, string passoword)
        {
           return _passwordHasher.HashPassword(user, passoword);
        }

        public async Task ValidateEmailIsUnique(string email)
        {
            var exists = await _repo.ExistsAsync(u => u.Email == email);
            if (exists)
            {
                throw new ValidationException("User e-mail is already registered.");
            }
        }

        public async Task ValidateUserIsAdmin(string userId)
        {
            var user = await ValidateAndGetUserById(userId);
            if (user.Role != UserRole.Parent)
            {
                throw new UnauthorizedAccessException("User is not an admin.");
            }
        }

        public void ValidateUserIsAssignedToTask(string userId, TaskItem task)
        {
            if (task.AssignedUserId != userId)
            {
                throw new UnauthorizedAccessException("Current user is not assigned to this task.");
            }
        }

        public async Task ValidateUserHasAccessToTask(string userId, TaskItem task)
        {
            var user = await ValidateAndGetUserById(userId);
            // If user is Admin -> exit method because it has access
            if (user.Role == UserRole.Parent)
            {
                return;
            }
            ValidateUserIsAssignedToTask(userId, task);
        }

        public async Task ValidateUserUnassignedOrExists(TaskItem task, string userId)
        {
            bool isUnassigned = userId.Equals("unassigned", StringComparison.OrdinalIgnoreCase);
            if (isUnassigned)
            {
                task.AssignedUserId = null;
                task.AssignedUser = null;
            }
            else
            {
                // Check if the assigned user exists
                await ValidateUserExists(userId);
            }
        }
    }
}
