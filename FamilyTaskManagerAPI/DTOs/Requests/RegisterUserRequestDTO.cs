using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Utils;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs.Requests
{
    public class RegisterUserRequestDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [RegularExpression(Utilities.PasswordRegEx, ErrorMessage = "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
        public string Password { get; set; } = string.Empty;

        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        public UserRole? Role { get; set; }
    }
}
