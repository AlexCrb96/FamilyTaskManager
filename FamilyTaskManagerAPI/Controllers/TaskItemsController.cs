using FamilyTaskManagerAPI.DTOs;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Services;
using FamilyTaskManagerAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FamilyTaskManagerAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemsController : Controller
    {
        private readonly TaskItemService _taskItemService;
        private readonly UserHandler _userHandler;

        public TaskItemsController(TaskItemService taskItemService, UserHandler userHandler)
        {
            _taskItemService = taskItemService;
            _userHandler = userHandler;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTaskItem([FromBody] CreateTaskItemRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string? userId = _userHandler.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            TaskItem input = dto.ToTaskItem();
            try
            {
                await _taskItemService.CreateTaskItemAsync(input);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "An error occurred while creating the task item.");
            }
            return Ok("Task item created successfully.");
        }
    }
}
