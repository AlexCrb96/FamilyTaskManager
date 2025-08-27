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

        [HttpPut("{taskId}/assignUser/{userId}")]
        public async Task<IActionResult> AssignUserToTaskItem(int taskId, string userId)
        {
            await _taskItemService.AssignUserToTaskItemAsync(taskId, userId, GetCurrentUserId());                        
            return Ok("User assigned to task item successfully.");
        }

        [HttpPut("{taskId}/updateStatus/{newStatus}")]
        public async Task<IActionResult> UpdateTaskItemStatus(int taskId, TaskItemStatus newStatus)
        {
            await _taskItemService.UpdateTaskStatusAsync(taskId, newStatus, GetCurrentUserId());            
            return Ok("Task item status updated successfully.");
        }

        [HttpPut("{taskId}/updateDueDate")]
        public async Task<IActionResult> UpdateTaskItemDueDate(int taskId, [FromBody] DateOnly? dueDate)
        {
            await _taskItemService.UpdateTaskDueDateAsync(taskId, dueDate, GetCurrentUserId());           
            return Ok("Task item due date updated successfully.");
        }

        [HttpPut("{taskId}/updateDescription")]
        public async Task<IActionResult> UpdateTaskItemDescription(int taskId, [FromBody] string description)
        {
            await _taskItemService.UpdateTaskItemDescriptionAsync(taskId, description, GetCurrentUserId());            
            return Ok("Task item description updated successfully.");
        }

        [HttpPut("{taskId}/updateTitle")]
        public async Task<IActionResult> UpdateTaskItemTitle(int taskId, [FromBody] UpdateTaskTitleRequestDTO dto)
        {
            await _taskItemService.UpdateTaskItemTitleAsync(taskId, dto.Title, GetCurrentUserId());            
            return Ok("Task item title updated successfully.");
        }

        [HttpPut("{taskId}/updateProgress")]
        public async Task<IActionResult> UpdateTaskItemProgress(int taskId, [FromBody] string progress)
        {
            await _taskItemService.UpdateTaskItemProgressAsync(taskId, progress, GetCurrentUserId());            
            return Ok("Task item progress updated successfully.");
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
