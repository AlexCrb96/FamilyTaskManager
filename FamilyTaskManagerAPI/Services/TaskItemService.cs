using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Data.Repositories;
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

        public async Task<int> CreateTaskItemAsync(TaskItem taskItem)
        {
            // Validate AssignedUser input
            await _userValidator.ValidateUserUnassignedOrExists(taskItem, taskItem.AssignedUserId);            

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

            // Validate AssignedUser input
            await _userValidator.ValidateUserUnassignedOrExists(task, userId);

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

        public async Task UpdateTaskDueDateAsync(int taskId, DateOnly? dueDate, string currentUserId)
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

        public async Task UpdateTaskItemTitleAsync(int taskId, string title, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            await _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            task.Title = title;
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
            string? keywords)
        {
            List<TaskItem> tasks = new List<TaskItem>();
            TaskItemsFilter filter = new TaskItemsFilter(userId, unassignedOnly, dueDate, noDueDateOnly, status, keywords);

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
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            await _userValidator.ValidateUserIsAdmin(currentUserId);

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
