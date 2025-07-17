using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs
{
    public class LoginUserRequestDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
