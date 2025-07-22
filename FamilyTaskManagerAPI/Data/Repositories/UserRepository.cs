using FamilyTaskManagerAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTaskManagerAPI.Data.Repositories
{
    public class UserRepository : Repository<User, string>
    {
        public UserRepository(TaskManagerDbContext context) : base(context) { }

        public async Task<User?> GetByEmailAsync(string email) => await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
}
