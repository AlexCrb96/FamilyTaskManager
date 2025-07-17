using FamilyTaskManagerAPI.Entities;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace FamilyTaskManagerAPI.DTOs
{
    public static class UserMapper
    {
        public static User ToUser(this RegisterUserRequestDTO dto)
        {
            User user = new User();

            user.Email = dto.Email;
            if (dto.Role.HasValue)
            {
                user.Role = dto.Role.Value;
            }
            else
            {
                user.Role = UserRole.User; // Default role if not specified
            }

            return user;
        }

        public static User ToUser(this LoginUserRequestDTO dto)
        {
            User user = new User();
            user.Email = dto.Email;
            return user;
        }
    }
}
