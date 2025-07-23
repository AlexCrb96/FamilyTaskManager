using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.Data
{
    public class TaskItemsFilter
    {
        public TaskItemStatus? Status { get; set; }

        public string? UserId { get; set; }
        public bool IsUserIdExplicitNull { get; set; } = false;

        public DateOnly? DueDate { get; set; }

        public List<string> Keywords { get; set; }

        public TaskItemsFilter(TaskItemStatus? status = null, string? userId = null, DateOnly? dueDate = null, string? keywords = null)
        {
            Status = status;

            if (userId.Trim().Equals("null", StringComparison.OrdinalIgnoreCase))
            {
                userId = null; // Handle "null" string as null
                IsUserIdExplicitNull = true; // Indicate that userId was explicitly set to null
            }
            UserId = userId;

            DueDate = dueDate;

            Keywords = new List<string>();
            if (!string.IsNullOrEmpty(keywords))
            {
                // Split keywords by comma and trim whitespace
                Keywords = keywords.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                                   .Select(k => k.ToLower())
                                   .ToList();
            }
        }
    }
}
