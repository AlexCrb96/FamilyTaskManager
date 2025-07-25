using System.Linq.Expressions;

namespace FamilyTaskManagerAPI.Data.Repositories
{
    public interface IRepository<TEntity, TId>
    {
        Task<List<TEntity>> GetAllAsync();
        Task<TEntity?> GetByIdAsync(TId id);
        Task AddAsync(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        Task SaveAsync();
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);
    }
}
