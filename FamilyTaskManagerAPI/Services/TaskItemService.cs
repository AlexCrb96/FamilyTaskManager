using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTaskManagerAPI.Services
{
    // desi peste tot folosesti acest context, ar fi mai bine sa iti creezi repositories pentru fiecare entitite (taskItem si users)
    // si injectezi in fiecare contextul asta. Idee e ca daca la un moment dat schimbi baza de date sau modul in care te conectezi
    // la baza de date tu va trebui sa faci un refactoring foarte mare, dar daca ai acele repositories, poti sa scapi schimband doar acolo
    public class TaskItemService(TaskManagerDbContext context)
    {
        public async Task<int> CreateTaskItemAsync(TaskItem taskItem)
        {
            // Check if another task with the same title exists
            await ValidateTitle(taskItem);

            // Check if the user exists if provided
            await ValidateAssignedUserExistsAsync(taskItem.AssignedUserId);

            // Add to context and save changes
            context.Tasks.Add(taskItem);
            await context.SaveChangesAsync();
            return taskItem.Id;
        }

        public async Task AssignUserToTaskItemAsync(int taskId, string userId)
        {
            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Check if the user exists
            await ValidateAssignedUserExistsAsync(userId);

            // Assign the user to the task item
            taskItem.AssignedUserId = userId;
            await context.SaveChangesAsync();
        }

        public async Task UpdateTaskStatusAsync(int taskId, TaskItemStatus newStatus)
        {
            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Update the status
            taskItem.Status = newStatus;
            await context.SaveChangesAsync();
        }

        public async Task UpdateTaskDueDateAsync(int taskId, DateTime dueDate)
        {
            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Validate the due date
            ValidateDueDate(dueDate);

            // Update the due date
            taskItem.DueDate = dueDate;
            await context.SaveChangesAsync();
        }

        internal async Task UpdateTaskItemDescriptionAsync(int taskId, string description)
        {
            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Update the description
            taskItem.Description = description;
            await context.SaveChangesAsync();
        }
        
        private async Task<TaskItemStatus> ValidateStatus(string status)
        {
            if (!Enum.TryParse<TaskItemStatus>(status, out var taskStatus))
            {
                throw new ArgumentException("Invalid status value.");
            }
            return taskStatus;
        }

        // ar merge mutat intr-un validator TaskItemValidator
        private async Task ValidateTitle(TaskItem taskItem)
        {
            // Check if a task with the same title already exists
            // e cam stricta validarea asta
            var existingTask = await context.Tasks.FirstOrDefaultAsync(t => t.Title == taskItem.Title);
            if (existingTask != null)
            {
                throw new ArgumentException("A task with the same title already exists.");
            }
        }

        // TaskItemValidator
        private void ValidateDueDate(DateTime dueDate)
        {
            if (dueDate < DateTime.UtcNow)
            {
                throw new ArgumentException("Due date cannot be in the past.");
            }
        }

        private async Task<TaskItem> GetTaskItemByIdAsync(int taskId)
        {
            var taskItem = await context.Tasks.FindAsync(taskId);
            if (taskItem == null)
            {
                throw new KeyNotFoundException("Task item does not exist.");
            }
            return taskItem;
        }

        // UserValidator
        private async Task ValidateAssignedUserExistsAsync(string? assignedUserId)
        {
            if (assignedUserId != null)
            {
                var user = await context.Users.FindAsync(assignedUserId);
                if (user == null)
                {
                    throw new ArgumentException("Assigned user does not exist.");
                }
            }
        }

        // UserValidator
        internal async Task IsCurrentUserAssignedOrAdmin(string? currentUserId, int taskId)
        {
            var taskItem = await GetTaskItemByIdAsync(taskId);
            var currentUser = await context.Users.FindAsync(currentUserId);
            if (currentUser == null)
            {
                throw new ArgumentException("Current user does not exist.");
            }

            if (currentUser.Role != UserRole.Parent || taskItem.AssignedUserId != currentUserId)
            {
                throw new UnauthorizedAccessException("Current user is not assigned to this task or is not an admin.");
            }
        }
    }
}
