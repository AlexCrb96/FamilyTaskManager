namespace FamilyTaskManagerAPI.Entities
{
    public enum UserRole
    {
        Parent,
        Child
    }

    public enum TaskItemStatus
    {
        ToDo,
        InProgress,
        Done,
        Overdue
    }

    public enum Permission
    {
        CreateTask,
        EditOwnTask,
        EditAnyTask,
        AssignTask,
        DeleteTask
    }
}
