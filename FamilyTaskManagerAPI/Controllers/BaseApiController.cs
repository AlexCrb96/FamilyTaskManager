using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FamilyTaskManagerAPI.Controllers
{
    public class BaseApiController : Controller
    {
        protected string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
