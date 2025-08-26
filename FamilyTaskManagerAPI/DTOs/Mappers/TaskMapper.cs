using FamilyTaskManagerAPI.DTOs.Requests;
using FamilyTaskManagerAPI.DTOs.Responses;
using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.DTOs.Mappers
{
    public static class TaskMapper
    {
        public static TaskItem ToTaskItem(this CreateTaskItemRequestDTO dto)
        {
            TaskItem task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Progress = dto.Progress,
                DueDate = dto.DueDate,
                Status = dto.Status ?? TaskItemStatus.ToDo, // Default to ToDo if not specified
                AssignedUserId = dto.AssignedUserId
            };
            return task;
        }

        public static TaskItemResponseDTO ToTaskItemResponse(this TaskItem task)
        {
            TaskItemResponseDTO dto = new TaskItemResponseDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Progress = task.Progress,
                DueDate = task.DueDate,
                Status = task.Status,
                CreatedAt = task.CreatedAt,
                CreatedByUserEmail = task.CreatedByUser.Email,
                AssignedUserEmail = task.AssignedUser?.Email,
            };
            return dto;

        }
    }
}
