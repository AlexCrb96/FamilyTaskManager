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
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                Status = task.Status,
                AssignedUserEmail = task.AssignedUser?.Email,
            };
            return dto;

        }
    }
}
