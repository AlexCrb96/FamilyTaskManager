using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.Data
{
    public class TaskItemsFilter
    {
        public string? UserId { get; set; }
        public bool IsUserIdExplicitNull { get; set; }

        public DateOnly? DueDate { get; set; }
        public bool IsDueDateExplicitNull { get; set; }

        public TaskItemStatus? Status { get; set; }

        public List<string> Keywords { get; set; }

        public TaskItemsFilter(
            string? userId = null,
            bool isUserIdExplicitNull = false,

            DateOnly? dueDate = null,
            bool isDueDateExplicitNull = false,

            TaskItemStatus? status = null,       

            string? keywords = null)
        {
            UserId = userId;
            IsUserIdExplicitNull = isUserIdExplicitNull;

            DueDate = dueDate;
            IsDueDateExplicitNull = isDueDateExplicitNull;

            Status = status;

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
