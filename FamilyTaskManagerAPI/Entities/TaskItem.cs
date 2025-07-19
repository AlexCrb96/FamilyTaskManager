using FamilyTaskManagerAPI.Entities;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Entities
{
    public class TaskItem
    {
        // Task details
        public int Id { get; set; }
        [Required(ErrorMessage = "A task should have a title.")]
        [StringLength(50, ErrorMessage = "The title should not exceed 50 characters.")]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public TaskItemStatus Status { get; set; }

        // Task relationships
        public string? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }
    }
}