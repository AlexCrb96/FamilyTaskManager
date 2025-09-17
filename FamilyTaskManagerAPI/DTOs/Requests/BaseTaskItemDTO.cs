using FamilyTaskManagerAPI.Entities;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs.Requests
{
    public abstract class BaseTaskItemDTO
    {
        [StringLength(100, ErrorMessage = "The title should not exceed 100 characters.")]
        public virtual string? Title { get; set; }
        public string? Description { get; set; }
        public string? Progress { get; set; }
        public DateOnly? DueDate { get; set; }
        public TaskItemStatus? Status { get; set; }
        public string? AssignedUserId { get; set; }
    }
}
