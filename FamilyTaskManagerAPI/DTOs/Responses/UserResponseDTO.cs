namespace FamilyTaskManagerAPI.DTOs.Responses
{
    public class UserResponseDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        
        // Maybe include Role later
    }
}
