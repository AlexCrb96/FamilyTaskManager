using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTaskManagerAPI.Services
{
    public class TaskItemService
    {
        private readonly TaskManagerDbContext _context;

        public TaskItemService(TaskManagerDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateTaskItemAsync(TaskItem taskItem)
        {
            // Check if another task with the same title exists
            await ValidateTitle(taskItem);

            // Check if the user exists if provided
            await ValidateAssignedUserExistsAsync(taskItem.AssignedUserId);

            // Add to context and save changes
            _context.Tasks.Add(taskItem);
            await _context.SaveChangesAsync();
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
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTaskStatusAsync(int taskId, string newStatus)
        {
            // Validate the new status
            var status = await ValidateStatus(newStatus);

            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Update the status
            taskItem.Status = status;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTaskDueDateAsync(int taskId, DateTime dueDate)
        {
            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Validate the due date
            ValidateDueDate(dueDate);

            // Update the due date
            taskItem.DueDate = dueDate;
            await _context.SaveChangesAsync();
        }

        internal async Task UpdateTaskItemDescriptionAsync(int taskId, string description)
        {
            // Find the task item
            var taskItem = await GetTaskItemByIdAsync(taskId);

            // Update the description
            taskItem.Description = description;
            await _context.SaveChangesAsync();
        }

        private async Task<TaskItemStatus> ValidateStatus(string status)
        {
            if (!Enum.TryParse<TaskItemStatus>(status, out var taskStatus))
            {
                throw new ArgumentException("Invalid status value.");
            }
            return taskStatus;
        }

        private async Task ValidateTitle(TaskItem taskItem)
        {
            // Check if a task with the same title already exists
            var existingTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Title == taskItem.Title);
            if (existingTask != null)
            {
                throw new ArgumentException("A task with the same title already exists.");
            }
        }

        private void ValidateDueDate(DateTime dueDate)
        {
            if (dueDate < DateTime.UtcNow)
            {
                throw new ArgumentException("Due date cannot be in the past.");
            }
        }

        private async Task<TaskItem> GetTaskItemByIdAsync(int taskId)
        {
            var taskItem = await _context.Tasks.FindAsync(taskId);
            if (taskItem == null)
            {
                throw new KeyNotFoundException("Task item does not exist.");
            }
            return taskItem;
        }

        private async Task ValidateAssignedUserExistsAsync(string? assignedUserId)
        {
            if (assignedUserId != null)
            {
                var user = await _context.Users.FindAsync(assignedUserId);
                if (user == null)
                {
                    throw new ArgumentException("Assigned user does not exist.");
                }
            }
        }


    }
}
