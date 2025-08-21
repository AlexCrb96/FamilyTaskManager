using FamilyTaskManagerAPI.Entities;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.Entities
{
    public class User
    {
        // User details
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required(ErrorMessage = "A user should have an e-mail.")]
        [StringLength(50, ErrorMessage = "The e-mail must not exceed 50 characters.")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "A user should have a password.")]
        [StringLength(256, ErrorMessage = "The password has must not exceed 256 characters.")]
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }

        // User relationships
        public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiration { get; set; }
    }
}
