using FamilyTaskManagerAPI.Entities;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace FamilyTaskManagerAPI.DTOs
{
    // sparge clasa asta in mappere pentru fiecare entitate in parte si pune-le intr-un namespace separat
    public static class DTOMapper
    {
        public static User ToUser(this RegisterUserRequestDTO dto)
        {
            User user = new User()
            {
                Email = dto.Email,
                Role = dto.Role ?? UserRole.Child // Default to Child if not specified
            };

            return user;
        }

        public static User ToUser(this LoginUserRequestDTO dto)
        {
            User user = new User()
            {
                Email = dto.Email
            };
            return user;
        }

        public static TaskItem ToTaskItem(this CreateTaskItemRequestDTO dto)
        {
            TaskItem task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                Status = dto.Status ?? TaskItemStatus.ToDo, // Default to ToDo if not specified
                AssignedUserId = dto.AssignedUserId
            };
            return task;
        }
    }
}
