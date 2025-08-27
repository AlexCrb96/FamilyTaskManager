using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.DTOs.Responses
{
    public class TaskItemResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Progress { get; set; } = string.Empty;
        public DateOnly? DueDate { get; set; }
        public TaskItemStatus Status { get; set; }
        public string CreatedByUserEmail { get; set; }
        public DateOnly CreatedAt { get; set; }
        public string? AssignedUserEmail { get; set; }
        public DateOnly? FinishedAt { get; set; }
    }
}
