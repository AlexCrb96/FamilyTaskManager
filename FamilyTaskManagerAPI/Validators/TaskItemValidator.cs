using FamilyTaskManagerAPI.Entities;
using static FamilyTaskManagerAPI.Data.Repositories.IRepository;


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

        public void ValidateDueDate(DateTime dueDate)
        {
            if (dueDate < DateTime.UtcNow)
            {
                throw new ArgumentException("Due date cannot be in the past.");
            }
        }
    }
}
