using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Services;

namespace FamilyTaskManagerAPI.Utils
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAdminUser(IServiceProvider services)
        {
            var configuration = services.GetRequiredService<IConfiguration>();
            var dbContext = services.GetRequiredService<TaskManagerDbContext>();
            var userService = services.GetRequiredService<UserService>();

            string adminEmail = configuration["AdminUser:Email"];
            string adminPassword = configuration["AdminUser:Password"];

            if (!dbContext.Users.Any(u => u.Role == UserRole.Parent))
            {
                // Create a default admin user
                User admin = new User
                {
                    Email = adminEmail,
                    Role = UserRole.Parent
                };

                await userService.RegisterUserAsync(admin, adminPassword);
            }
        }
    }
}
