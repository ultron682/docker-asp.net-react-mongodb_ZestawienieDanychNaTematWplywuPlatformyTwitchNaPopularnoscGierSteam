using ProjektASP_NET.Models;

namespace ProjektASP_NET.Interface
{
    public interface IGameRepository
    {
        //Task<Game> GetByIdAsync(ObjectId id);
        Task<SteamAndTwitch> GetByGameIdAsync(string gameId);
        //Task<IEnumerable<Game>> GetAllAsync(int offset, int fetch);
        Task<IEnumerable<GameListItem>> GetGameListAsync(); // Nowa metoda

        Task<IEnumerable<object>> GetAllGameStatsAsync();
    }
}
