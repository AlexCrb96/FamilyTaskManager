using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.DTOs.Requests;
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

        // ----------------------
        // General helpers
        // ----------------------
        #region General helpers
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

        public bool IsTargetUserUnassigned(string userId)
        {
            return userId.Equals("unassigned", StringComparison.OrdinalIgnoreCase);
        }

        public void ValidateNamesInput(string? firstName, string? lastName)
        {
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName))
            {
                throw new ValidationException("Provide at least one name to update.");
            }
        }
        #endregion

        // ----------------------
        // Permission checks
        // ----------------------
        #region Permission checks
        private void ValidateCanCreateTask(User user)
        {
            if (!RolePermissions.HasPermission(user.Role, Permission.CreateTask))
            {
                throw new UnauthorizedAccessException("User does not have permission to create tasks.");
            }
        }

        private void ValidateCanEditTask(User user, TaskItem task, string? effectiveAssignedUserId = null)
        {   
            string assignedUserIdToCheck = effectiveAssignedUserId ?? task.AssignedUserId;

            bool canEdit = RolePermissions.HasPermission(user.Role, Permission.EditAnyTask) ||
                           (RolePermissions.HasPermission(user.Role, Permission.EditOwnTask) && assignedUserIdToCheck == user.Id);

            if (!canEdit)
            {
                throw new UnauthorizedAccessException("User does not have permission to edit this task.");
            }
        }

        private void ValidateCanAssignTask(User user, TaskItem task, string targetUserId)
        {
            if (user.Role == UserRole.Child)
            {
                if (task.AssignedUserId != null || targetUserId != user.Id)
                {
                    throw new UnauthorizedAccessException("Non-admin users can only assign unassigned tasks to themselves.");
                }
            }
            else if (!RolePermissions.HasPermission(user.Role, Permission.AssignTask))
            {
                throw new UnauthorizedAccessException("User cannot assign task to others.");
            }
        }

        public void ValidateCanDeleteTask(User user)
        {
            if (!RolePermissions.HasPermission(user.Role, Permission.DeleteTask))
            {
                throw new UnauthorizedAccessException("User does not have permission to delete tasks.");
            }
        }

        public void ValidatePermissions(User currentUser, TaskItem currentTask, EditTaskItemRequestDTO inputTask, string? targetUserId)
        {

            // If the assigned user is being changed, validate the permission to assign
            if (!string.IsNullOrEmpty(inputTask.AssignedUserId) && inputTask.AssignedUserId != currentTask.AssignedUserId)
            {
                ValidateCanAssignTask(currentUser, currentTask, inputTask.AssignedUserId);
            }

            if (inputTask.Title != null || inputTask.Description != null ||  inputTask.Progress != null || inputTask.DueDate.HasValue || inputTask.Status.HasValue)
            {
                ValidateCanEditTask(currentUser, currentTask, targetUserId);
            }
        }
        #endregion
    }
}
