using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.DTOs.Requests;
using FamilyTaskManagerAPI.Entities;
using System.ComponentModel.DataAnnotations;


namespace FamilyTaskManagerAPI.Validators
{
    public class TaskItemValidator
    {
        private readonly IRepository<TaskItem, int> _repo;

        public TaskItemValidator(IRepository<TaskItem, int> taskItemRepo)
        {
            _repo = taskItemRepo;
        }
        public async Task<TaskItem> ValidateAndGetTask(int taskId)
        {
            return await _repo.GetByIdAsync(taskId) ?? throw new KeyNotFoundException($"Task with ID {taskId} does not exist.");
        }

        public void ValidateTasksNotEmpty (List<TaskItem> tasks)
        {
            if (tasks == null || tasks.Count == 0)
            {
                throw new KeyNotFoundException("No tasks found.");
            }
        }

        public void ValidateEditInput(EditTaskItemRequestDTO dto)
        {
            ValidateTitle(dto.Title);
            ValidateDueDate(dto.DueDate);
        }

        private void ValidateTitle(string? title)
        {
            if (title != null)
            {
                if (string.IsNullOrEmpty(title.Trim()))
                {
                    throw new ValidationException("A task should have a title.");
                }
            }
        }
        private void ValidateDueDate(DateOnly? dueDate)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (dueDate < today)
            {
                throw new ArgumentException("Due date cannot be in the past.");
            }
        }
    }
}
