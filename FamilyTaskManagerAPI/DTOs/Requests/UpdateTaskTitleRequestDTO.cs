using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs.Requests
{
    public class UpdateTaskTitleRequestDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "The title should not exceed 100 characters.")]
        public string Title { get; set; }
    }
}
