using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace FamilyTaskManagerAPI.DTOs.Responses
{
    public class ErrorResponseDTO
    {
        public int StatusCode { get; set; }
        public string Error { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; }
        public string? Path { get; set; }
        public List<string>? ValidationErrors { get; set; }

    }
}
