using FamilyTaskManagerAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTaskManagerAPI.Data.Repositories
{
    public class TaskItemRepository : Repository<TaskItem, int>
    {
        public TaskItemRepository(TaskManagerDbContext context) : base(context) { }

        public async Task<List<TaskItem>> GetTasksByStatusAsync(TaskItemStatus? status) => await _dbSet.Include(t => t.AssignedUser)
                                                                                                        .Where(t => t.Status == status)
                                                                                                        .ToListAsync();
        public async Task<List<TaskItem>> GetTasksByAssignedUserIdAsync(string? userId) => await _dbSet.Include(t => t.AssignedUser)
                                                                                                        .Where(t => t.AssignedUserId == userId)
                                                                                                        .ToListAsync();
        public async Task<List<TaskItem>> GetAllUnassignedTasksAsync() => await _dbSet.Where(t => t.AssignedUserId == null)
                                                                                  .ToListAsync();

        public async Task<List<TaskItem>> GetTasksAssignedToUserWithGivenStatusAsync(TaskItemStatus? status, string userId) => await _dbSet.Include(t => t.AssignedUser)
                                                                                                        .Where(t => t.AssignedUserId == userId && t.Status == status)
                                                                                                        .ToListAsync();
        public async Task<List<TaskItem>> GetFilteredTasksAsync(TaskItemsFilter filter)
        {
            IQueryable<TaskItem> query = _dbSet
                .Include(t => t.AssignedUser)
                .Include(t => t.CreatedByUser);

            if (filter.IsUserIdExplicitNull)
            {
                query = query.Where(t => t.AssignedUserId == null);
            }
            else if (filter.UserId != null)
            {
                query = query.Where(t => t.AssignedUserId == filter.UserId);
            }

            if (filter.Status != null)
            {
                query = query.Where(t => t.Status == filter.Status);
            }

            if (filter.IsDueDateExplicitNull)
            {
                query = query.Where(t => t.DueDate == null);
            }
            else if (filter.DueDate != null)
            {
                query = query.Where(t => t.DueDate == filter.DueDate);
            }

            foreach (string keyword in filter.Keywords)
            {
                string pattern = $"%{keyword}%";
                query = query.Where(t => EF.Functions.Like(t.Title, pattern) ||
                                         EF.Functions.Like(t.Description, pattern) ||
                                         EF.Functions.Like(t.Progress, pattern));
            }

            if (filter.CreatedByUserId != null)
            {
                query = query.Where(t => t.CreatedByUserId == filter.CreatedByUserId);
            }

            if (filter.CreatedAt != null)
            {
                query = query.Where(t => t.CreatedAt == filter.CreatedAt);
            }

            if (filter.IsFinishedAtExplicitNull)
            {
                query = query.Where(t => t.FinishedAt == null);
            }
            else if (filter.FinishedAt != null)
            {
                query = query.Where(t => t.FinishedAt == filter.FinishedAt);
            }

            return await query.ToListAsync();
        }

    }
}
