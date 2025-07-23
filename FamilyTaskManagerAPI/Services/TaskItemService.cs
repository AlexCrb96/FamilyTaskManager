using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Validators;
using Microsoft.EntityFrameworkCore;
using FamilyTaskManagerAPI.Data.Repositories;

namespace FamilyTaskManagerAPI.Services
{
    public class TaskItemService
    {
        private readonly TaskItemRepository _repo;
        private readonly UserValidator _userValidator;
        private readonly TaskItemValidator _taskItemValidator;

        public TaskItemService(TaskItemRepository repository, UserValidator userValidator, TaskItemValidator taskItemValidator)
        {
            _repo = repository;
            _userValidator = userValidator;
            _taskItemValidator = taskItemValidator;
        }

        public async Task<int> CreateTaskItemAsync(TaskItem taskItem)
        {
            // Check if the user exists if provided
            await _userValidator.ValidateUserExists(taskItem.AssignedUserId);

            // Add to context and save changes
            await _repo.AddAsync(taskItem);
            await _repo.SaveAsync();
            return taskItem.Id;
        }

        public async Task AssignUserToTaskItemAsync(int taskId, string userId, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            await _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Check if the assigned user exists
            await _userValidator.ValidateUserExists(userId);

            // Assign the user to the task item
            task.AssignedUserId = userId;
            await _repo.SaveAsync();
        }

        public async Task UpdateTaskStatusAsync(int taskId, TaskItemStatus newStatus, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            await _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Update the status
            task.Status = newStatus;
            await _repo.SaveAsync();
        }

        public async Task UpdateTaskDueDateAsync(int taskId, DateOnly dueDate, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            await _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Validate the due date
            _taskItemValidator.ValidateDueDate(dueDate);

            // Update the due date
            task.DueDate = dueDate;
            await _repo.SaveAsync();
        }

        public async Task UpdateTaskItemDescriptionAsync(int taskId, string description, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            await _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Update the description
            task.Description = description;
            await _repo.SaveAsync();
        }

        public async Task<List<TaskItem>> GetAllTaskItemsByStatusAsync(TaskItemStatus? status, string currentUserId)
        {
            // Fetch tasks by status
            List<TaskItem> tasks = await _repo.GetTasksByStatusAsync(status);

            // Check if the list is empty
            _taskItemValidator.ValidateTasksNotEmpty(tasks);

            return tasks;
        }

        public async Task<List<TaskItem>> GetAllTaskItemsByUserAsync(string? userId, string? v)
        {
            // Fetch tasks by assigned user
            List<TaskItem> tasks = await _repo.GetTasksByAssignedUserIdAsync(userId);

            // Check if the list is empty
            _taskItemValidator.ValidateTasksNotEmpty(tasks);

            return tasks;
        }

        public async Task<List<TaskItem>> GetFilteredTaskItems (TaskItemStatus? status, string? userId, DateOnly? dueDate, string? keywords)
        {
            List<TaskItem> tasks = new List<TaskItem>();
            TaskItemsFilter filter = new TaskItemsFilter(status, userId, dueDate, keywords);

            if (!string.IsNullOrEmpty(filter.UserId))
            {
                await _userValidator.ValidateUserExists(filter.UserId);
            }

            // Fetch tasks based on the provided filters
            tasks = await _repo.GetFilteredTasksAsync(filter);

            // Check if the list is empty
            _taskItemValidator.ValidateTasksNotEmpty(tasks);

            return tasks;
        }
    }
}
