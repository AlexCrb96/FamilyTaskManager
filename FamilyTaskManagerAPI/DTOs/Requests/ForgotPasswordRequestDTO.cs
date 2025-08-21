using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs.Requests
{
    public class ForgotPasswordRequestDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
