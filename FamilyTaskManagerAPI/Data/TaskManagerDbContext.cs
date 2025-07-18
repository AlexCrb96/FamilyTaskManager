using Microsoft.EntityFrameworkCore;
using FamilyTaskManagerAPI.Entities;

namespace FamilyTaskManagerAPI.Data
{
    public class TaskManagerDbContext : DbContext
    {
        public TaskManagerDbContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<TaskItem> Tasks => base.Set<TaskItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Primary keys
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<TaskItem>().HasKey(t => t.Id);

            // Convert enum properties to strings in the database
            modelBuilder.Entity<User>().Property(u=> u.Role).HasConversion<string>();
            modelBuilder.Entity<TaskItem>().Property(t => t.Status).HasConversion<string>();

            // Index for unique email
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            // Default values for properties
            modelBuilder.Entity<User>().Property(u => u.Role).HasDefaultValue(UserRole.Child);
            modelBuilder.Entity<TaskItem>().Property(t => t.Status).HasDefaultValue(TaskItemStatus.ToDo);

            // Relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.AssignedTasks)
                .WithOne(t => t.AssignedUser)
                .HasForeignKey(t => t.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull); // Set to null if user is deleted
        }

    }
}
