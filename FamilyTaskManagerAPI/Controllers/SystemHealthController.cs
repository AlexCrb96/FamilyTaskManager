using FamilyTaskManagerAPI.DTOs.Responses;
using FamilyTaskManagerAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FamilyTaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemHealthController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult GetHealth()
        {
            var healthDto = new HealthResponseDTO
            {
                DatabaseOk = SystemHealthService.LastDbPingSuccessful,
                LastChecked = SystemHealthService.LastDbPingTime
            };

            return Ok(healthDto);
        }
    }
}