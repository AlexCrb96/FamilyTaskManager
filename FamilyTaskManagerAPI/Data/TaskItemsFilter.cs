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

        public string? CreatedByUserId { get; set; }

        public DateOnly? CreatedAt { get; set; }

        public DateOnly? FinishedAt { get; set; }
        public bool IsFinishedAtExplicitNull { get; set; }

        public TaskItemsFilter(
            string? userId = null,
            bool isUserIdExplicitNull = false,

            DateOnly? dueDate = null,
            bool isDueDateExplicitNull = false,

            TaskItemStatus? status = null,       

            string? keywords = null,

            string? createdByUserId = null,

            DateOnly? createdAt = null,

            DateOnly? finishedAt = null,
            bool isFinishedAtExplicitNull = false)
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

            CreatedByUserId = createdByUserId;

            CreatedAt = createdAt;

            FinishedAt = finishedAt;
            IsFinishedAtExplicitNull = isFinishedAtExplicitNull;
        }
    }
}
