using FamilyTaskManagerAPI.DTOs.Requests;
using FamilyTaskManagerAPI.DTOs.Responses;
using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.DTOs.Mappers
{
    public static class UserMapper
    {
        public static User ToUser(this RegisterUserRequestDTO dto)
        {
            User user = new User()
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
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

        public static UserResponseDTO ToUserResponse(this User user)
        {
            UserResponseDTO dto = new UserResponseDTO()
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
            return dto;
        }
    }
}
