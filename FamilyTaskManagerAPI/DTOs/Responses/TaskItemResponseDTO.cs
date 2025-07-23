using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.DTOs.Responses
{
    public class TaskItemResponseDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public DateOnly? DueDate { get; set; }
        public TaskItemStatus Status { get; set; }
        public string? AssignedUserEmail { get; set; }
    }
}
