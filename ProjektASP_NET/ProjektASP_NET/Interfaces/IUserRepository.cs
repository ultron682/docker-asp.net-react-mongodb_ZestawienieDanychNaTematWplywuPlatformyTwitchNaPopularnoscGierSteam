using ProjektASP_NET.Models;

namespace ProjektASP_NET.Interface
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User model);
        Task UpdateAsync(string id, User model);
        Task DeleteAsync(string id);
        Task<User> GetByIdAsync(string id);
        Task<IEnumerable<User>> GetAllAsync(int offset, int fetch);
        Task<User> GetByEmailAsync(string email);
    }
}
