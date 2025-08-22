using FamilyTaskManagerAPI.DTOs.Mappers;
using FamilyTaskManagerAPI.DTOs.Requests;
using FamilyTaskManagerAPI.DTOs.Responses;
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

        public TaskItemsController(TaskItemService taskItemService)
        {
            _taskItemService = taskItemService;
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
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
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
                await _taskItemService.AssignUserToTaskItemAsync(taskId, userId, GetCurrentUserId());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
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
        public async Task<IActionResult> UpdateTaskItemStatus(int taskId, TaskItemStatus newStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _taskItemService.UpdateTaskStatusAsync(taskId, newStatus, GetCurrentUserId());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
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
        public async Task<IActionResult> UpdateTaskItemDueDate(int taskId, [FromBody] DateOnly? dueDate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _taskItemService.UpdateTaskDueDateAsync(taskId, dueDate, GetCurrentUserId());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
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
                await _taskItemService.UpdateTaskItemDescriptionAsync(taskId, description, GetCurrentUserId());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
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

        [HttpPut("{taskId}/updateTitle")]
        public async Task<IActionResult> UpdateTaskItemTitle(int taskId, [FromBody] UpdateTaskTitleRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _taskItemService.UpdateTaskItemTitleAsync(taskId, dto.Title, GetCurrentUserId());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
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
                    title: "An error occurred while updating the task item title.");
            }

            return Ok("Task item title updated successfully.");
        }

        [HttpGet()]
        public async Task<IActionResult> GetFilteredTaskItems(
            [FromQuery] string? userId,
            [FromQuery] DateOnly? dueDate,
            [FromQuery] TaskItemStatus? status,
            [FromQuery] string? keywords,
            [FromQuery] bool unassignedOnly = false,
            [FromQuery] bool noDueDateOnly = false)
        {
            try
            {
                List<TaskItem> taskItems = await _taskItemService.GetFilteredTaskItems(userId, unassignedOnly, dueDate, noDueDateOnly, status, keywords);
                List<TaskItemResponseDTO> taskItemsDto = taskItems.Select(t => t.ToTaskItemResponse()).ToList();

                return Ok(taskItemsDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "An error occurred while retrieving task items by status.");
            }
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTaskItem(int taskId)
        {
            try
            {
                await _taskItemService.DeleteTaskItemAsync(taskId, GetCurrentUserId());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: "An error occurred while deleting the task item.");
            }
            return Ok("Task item deleted successfully.");
        }

        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
