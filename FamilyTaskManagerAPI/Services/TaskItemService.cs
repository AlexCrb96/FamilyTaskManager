using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Validators;
using Microsoft.EntityFrameworkCore;
using static FamilyTaskManagerAPI.Data.Repositories.IRepository;

namespace FamilyTaskManagerAPI.Services
{
    public class TaskItemService
    {
        private readonly IRepository<TaskItem, int> _repo;
        private readonly UserValidator _userValidator;
        private readonly TaskItemValidator _taskItemValidator;

        public TaskItemService(IRepository<TaskItem, int> repository, UserValidator userValidator, TaskItemValidator taskItemValidator)
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
            _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Check if the assigned user exists
            await _userValidator.ValidateUserExists(userId);

            // Assign the user to the task item
            task.AssignedUserId = userId;
            await _repo.SaveAsync();
        }

        public async Task UpdateTaskStatusAsync(int taskId, string newStatus, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Validate the new status
            var status = await _taskItemValidator.ValidateStatus(newStatus);

            // Update the status
            task.Status = status;
            await _repo.SaveAsync();
        }

        public async Task UpdateTaskDueDateAsync(int taskId, DateTime dueDate, string currentUserId)
        {
            // Validate the task item exists
            TaskItem task = await _taskItemValidator.ValidateAndGetTask(taskId);

            // Check if the current user is assigned or admin
            _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

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
            _userValidator.ValidateUserHasAccessToTask(currentUserId, task);

            // Update the description
            task.Description = description;
            await _repo.SaveAsync();
        }
    }
}
