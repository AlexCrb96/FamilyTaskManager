namespace FamilyTaskManagerAPI.DTOs.Responses
{
    public class HealthResponseDTO
    {
        public bool DatabaseOk { get; set; }
        public DateTime LastChecked { get; set; }
    }
}
