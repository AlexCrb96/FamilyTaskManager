using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.DTOs.Mappers;
using FamilyTaskManagerAPI.DTOs.Requests;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Validators;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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

        public async Task<int> CreateTaskItemAsync(TaskItem taskItem, string currentUserId)
        {
            // Validate AssignedUser input
            if (_userValidator.IsTargetUserUnassigned(taskItem.AssignedUserId))
            {
                taskItem.AssignedUser = null;
                taskItem.AssignedUserId = null;
            }
            else
            {
                await _userValidator.ValidateUserExists(taskItem.AssignedUserId);
            }

            // Trim whitespace at the end of title and description
            taskItem.Title = taskItem.Title.Trim();
            taskItem.Description = taskItem.Description?.Trim();
            taskItem.Progress = taskItem.Progress?.Trim();
            taskItem.CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
            taskItem.CreatedByUserId = currentUserId;

            // Add to context and save changes
            await _repo.AddAsync(taskItem);
            await _repo.SaveAsync();
            return taskItem.Id;
        }

        public async Task EditTaskItemAsync(int taskId, EditTaskItemRequestDTO inputTask, string? currentUserId)
        {
            // Read the current user information from the database
            User user = await _userValidator.ValidateAndGetUserById(currentUserId);

            // Validate the task item exists
            var task = await _taskItemValidator.ValidateAndGetTask(taskId);

            string targetUserId = inputTask.AssignedUserId ?? task.AssignedUserId;

            _userValidator.ValidatePermissions(user, task, inputTask, targetUserId);

            _taskItemValidator.ValidateEditInput(inputTask);
            task.ApplyEdits(inputTask);

            if (task.Status == TaskItemStatus.Done)
            {
                task.FinishedAt = DateOnly.FromDateTime(DateTime.UtcNow);
            }

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

        public async Task<List<TaskItem>> GetFilteredTaskItems (
            string? userId,
            bool unassignedOnly,
            DateOnly? dueDate,
            bool noDueDateOnly,
            TaskItemStatus? status,
            string? keywords,
            string? createdBy,
            DateOnly? createdAt,
            DateOnly? finishedAt,
            bool unfinishedOnly)
        {
            List<TaskItem> tasks = new List<TaskItem>();
            TaskItemsFilter filter = new TaskItemsFilter(userId, unassignedOnly, dueDate, noDueDateOnly, status, keywords, createdBy, createdAt, finishedAt, unfinishedOnly);

            if (!string.IsNullOrEmpty(userId) && unassignedOnly == false)
            {
                await _userValidator.ValidateUserExists(userId);
            }

            // Fetch tasks based on the provided filters
            tasks = await _repo.GetFilteredTasksAsync(filter);

            // Check if the list is empty
            _taskItemValidator.ValidateTasksNotEmpty(tasks);

            return tasks;
        }

        public async Task DeleteTaskItemAsync(int taskId, string? currentUserId)
        {
            // Read the current user information from the database
            User user = await _userValidator.ValidateAndGetUserById(currentUserId);

            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            _userValidator.ValidateCanDeleteTask(user);

            // Remove the task item
            _repo.Delete(task);
            try
            {
                await _repo.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new KeyNotFoundException($"Task with ID {taskId} does not exist or has already been deleted.");
            }
        }
    }
}
