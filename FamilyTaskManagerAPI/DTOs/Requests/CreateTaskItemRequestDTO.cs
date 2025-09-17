using System.ComponentModel.DataAnnotations;

namespace FamilyTaskManagerAPI.DTOs.Requests
{
    public class CreateTaskItemRequestDTO : BaseTaskItemDTO
    {
        [Required(ErrorMessage = "A task should have a title.")]
        public override string Title 
        { 
            get => base.Title; 
            set => base.Title = value; 
        }
    }
}
