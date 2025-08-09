using FamilyTaskManagerAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

/*            // Default values for properties
            modelBuilder.Entity<User>().Property(u => u.Role).HasDefaultValue(UserRole.Child);cd 
            modelBuilder.Entity<TaskItem>().Property(t => t.Status).HasDefaultValue(TaskItemStatus.ToDo);*/

            // Create a ValueConverter for DateOnly to DateTime
            var nullableDateOnlyConverter = new ValueConverter<DateOnly?, DateTime?>(
                                                                            d => d.HasValue ? d.Value.ToDateTime(TimeOnly.MinValue) : null,
                                                                            d => d.HasValue ? DateOnly.FromDateTime(d.Value) : null);
            // Convert DateOnly to DateTime for database storage
            modelBuilder.Entity<TaskItem>()
                .Property(t => t.DueDate)
                .HasConversion(nullableDateOnlyConverter)
                .HasColumnType("date"); // Use date type for DueDate

            // Relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.AssignedTasks)
                .WithOne(t => t.AssignedUser)
                .HasForeignKey(t => t.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull); // Set to null if user is deleted
        }

        // Add logging configuration for debugging purposes
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information);
        }

    }
}
