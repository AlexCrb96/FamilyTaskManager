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
            return Ok(new
            {
                DatabaseOk = SystemHealthService.LastDbPingSuccessful,
                LastChecked = SystemHealthService.LastDbPingTime
            });
        }
    }
}