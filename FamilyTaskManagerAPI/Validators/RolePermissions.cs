using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.Validators
{
    public static class RolePermissions
    {
        private static readonly Dictionary<UserRole, HashSet<Permission>> _permissions = new()
        {
            [UserRole.Child] = new HashSet<Permission>
            {
                Permission.CreateTask,
                Permission.EditOwnTask
            },

            [UserRole.Parent] = new HashSet<Permission>
            {
                Permission.CreateTask,
                Permission.EditOwnTask,
                Permission.EditAnyTask,
                Permission.AssignTask,
                Permission.DeleteTask
            }
        };

        public static bool HasPermission(UserRole role, Permission permission) => 
            _permissions.TryGetValue(role, out var perms) && perms.Contains(permission);
    }
}
