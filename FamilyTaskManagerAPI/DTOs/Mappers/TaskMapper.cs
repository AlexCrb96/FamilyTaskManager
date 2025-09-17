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

        public static void ApplyEdits(this TaskItem task, EditTaskItemRequestDTO dto)
        {
            if (!string.IsNullOrEmpty(dto.Title))
                task.Title = dto.Title.Trim();

            if (dto.Description != null)
                task.Description = dto.Description.Trim();

            if (dto.Progress != null)
                task.Progress = dto.Progress.Trim();

            if (dto.DueDate.HasValue)
                task.DueDate = dto.DueDate.Value;

            if (dto.Status.HasValue)
                task.Status = dto.Status.Value;

            if (!string.IsNullOrEmpty(dto.AssignedUserId))
                task.AssignedUserId = dto.AssignedUserId;
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
                FinishedAt = task.FinishedAt,
            };
            return dto;

        }
    }
}
