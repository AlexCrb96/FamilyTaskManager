using FamilyTaskManagerAPI.DTOs;
using FamilyTaskManagerAPI.DTOs.Mappers;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Services;
using FamilyTaskManagerAPI.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpPut("{taskId}/assignUser/{userId}")]
        public async Task<IActionResult> AssignUserToTaskItem(int taskId, string userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string? currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                await _taskItemService.IsCurrentUserAssignedOrAdmin(currentUserId, taskId);
                await _taskItemService.AssignUserToTaskItemAsync(taskId, userId);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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
                    title: "An error occurred while assigning the user to the task item.");
            }
            return Ok("User assigned to task item successfully.");
        }

        [HttpPut("{taskId}/updateStatus/{newStatus}")]
        public async Task<IActionResult> UpdateTaskItemStatus(int taskId, string newStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string? currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                await _taskItemService.IsCurrentUserAssignedOrAdmin(currentUserId, taskId);
                await _taskItemService.UpdateTaskStatusAsync(taskId, newStatus);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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
                    title: "An error occurred while updating the task item status.");
            }
            return Ok("Task item status updated successfully.");
        }

        [HttpPut("{taskId}/updateDueDate")]
        public async Task<IActionResult> UpdateTaskItemDueDate(int taskId, [FromBody] DateTime dueDate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string? currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                await _taskItemService.IsCurrentUserAssignedOrAdmin(currentUserId, taskId);
                await _taskItemService.UpdateTaskDueDateAsync(taskId, dueDate);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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
                    title: "An error occurred while updating the task item due date.");
            }
            return Ok("Task item due date updated successfully.");
        }

        [HttpPut("{taskId}/updateDescription")]
        public async Task<IActionResult> UpdateTaskItemDescription(int taskId, [FromBody] string description)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string? currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                await _taskItemService.IsCurrentUserAssignedOrAdmin(currentUserId, taskId);
                await _taskItemService.UpdateTaskItemDescriptionAsync(taskId, description);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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
                    title: "An error occurred while updating the task item description.");
            }
            return Ok("Task item description updated successfully.");
        }
    }
}
