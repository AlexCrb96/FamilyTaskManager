using FamilyTaskManagerAPI.Utils;
using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs.Requests
{
    public class ChangePasswordRequestDTO
    {
        [Required]
        [RegularExpression(Utilities.PasswordRegEx, ErrorMessage = "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
        public string OldPassword { get; set; }
        [Required]
        [RegularExpression(Utilities.PasswordRegEx, ErrorMessage = "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
        public string NewPassword { get; set; }
    }
}
