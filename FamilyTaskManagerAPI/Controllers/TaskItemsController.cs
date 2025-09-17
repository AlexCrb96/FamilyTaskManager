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
    public class TaskItemsController : BaseApiController
    {
        private readonly TaskItemService _taskItemService;

        public TaskItemsController(TaskItemService taskItemService)
        {
            _taskItemService = taskItemService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTaskItem([FromBody] CreateTaskItemRequestDTO dto)
        {
            TaskItem input = dto.ToTaskItem();
            await _taskItemService.CreateTaskItemAsync(input, GetCurrentUserId());
            return Ok("Task item created successfully.");
        }

        [HttpPatch("{taskId}/editTask")]
        public async Task<IActionResult> EditTaskItem(int taskId, [FromBody] EditTaskItemRequestDTO dto)
        {
            await _taskItemService.EditTaskItemAsync(taskId, dto, GetCurrentUserId());            
            return Ok("Task item edited successfully.");
        }

        [HttpGet()]
        public async Task<IActionResult> GetFilteredTaskItems(
            [FromQuery] string? userId,
            [FromQuery] DateOnly? dueDate,
            [FromQuery] TaskItemStatus? status,
            [FromQuery] string? keywords,
            [FromQuery] string? createdBy,
            [FromQuery] DateOnly? createdAt,
            [FromQuery] DateOnly? finishedAt,
            [FromQuery] bool unassignedOnly = false,
            [FromQuery] bool noDueDateOnly = false,
            [FromQuery] bool unfinishedOnly = false
            )
        {
            List<TaskItem> taskItems = await _taskItemService.GetFilteredTaskItems(userId, unassignedOnly, dueDate, noDueDateOnly, status, keywords, createdBy, createdAt, finishedAt, unfinishedOnly);
            List<TaskItemResponseDTO> taskItemsDto = taskItems.Select(t => t.ToTaskItemResponse()).ToList();
            return Ok(taskItemsDto);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTaskItem(int taskId)
        {
            await _taskItemService.DeleteTaskItemAsync(taskId, GetCurrentUserId());            
            return Ok("Task item deleted successfully.");
        }
    }
}
