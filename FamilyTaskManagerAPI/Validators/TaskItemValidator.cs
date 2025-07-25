using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Data.Repositories;


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

        public async Task<TaskItemStatus> ValidateStatus(string status)
        {
            if (!Enum.TryParse<TaskItemStatus>(status, out var taskStatus))
            {
                throw new ArgumentException("Invalid status value.");
            }
            return taskStatus;
        }

        public void ValidateDueDate(DateOnly dueDate)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (dueDate < today)
            {
                throw new ArgumentException("Due date cannot be in the past.");
            }
        }

        public void ValidateTasksNotEmpty (List<TaskItem> tasks)
        {
            if (tasks == null || tasks.Count == 0)
            {
                throw new KeyNotFoundException("No tasks found.");
            }
        }
    }
}
