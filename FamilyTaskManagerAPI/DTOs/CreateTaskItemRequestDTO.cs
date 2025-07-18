using FamilyTaskManagerAPI.Entities;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs
{
    public class CreateTaskItemRequestDTO
    {
        [Required(ErrorMessage = "A task should have a title.")]
        [StringLength(50, ErrorMessage = "The title should not exceed 50 characters.")]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public TaskItemStatus? Status { get; set; }
        public string? AssignedUserId { get; set; }
    }
}
