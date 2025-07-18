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
            // Check if a task with the same title already exists
            var existingTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Title == taskItem.Title);
            if (existingTask != null)
            {
                throw new ArgumentException("A task with the same title already exists.");
            }

            // Check if task has an assigned user
            if (taskItem.AssignedUserId != null)
            {
                var assignedUser = await _context.Users.FindAsync(taskItem.AssignedUserId);
                if (assignedUser == null)
                {
                    throw new ArgumentException("Assigned user does not exist.");
                }
                taskItem.AssignedUserId = assignedUser.Id;
            }

            // Add to context and save changes
            _context.Tasks.Add(taskItem);
            await _context.SaveChangesAsync();
            return taskItem.Id;
        }

    }
}
