using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FamilyTaskManagerAPI.Data.Repositories
{
    public class Repository<T, TId> : IRepository<T, TId> where T : class
    {
        protected readonly TaskManagerDbContext _db;
        protected readonly DbSet<T> _dbSet;

        public Repository(TaskManagerDbContext context)
        {
            _db = context;
            _dbSet = _db.Set<T>();
        }

        public async Task<List<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public virtual async Task<T?> GetByIdAsync(TId id) => await _dbSet.FindAsync(id);

        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Delete(T entity) => _dbSet.Remove(entity);

        public async Task SaveAsync() => await _db.SaveChangesAsync();

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) => await _dbSet.AnyAsync(predicate);

        public async Task<bool> PingAsync(CancellationToken cancellationToken = default)
        {
            bool result = false;

            try
            {
                await _db.Database.ExecuteSqlRawAsync("SELECT 1;", cancellationToken);
                result = true;
            }catch
            {
                result = false;
            }

            return result;
        }
    }
}
