using MongoDB.Driver;
using ProjektASP_NET.Interface;
using ProjektASP_NET.Models;

namespace ProjektASP_NET.Services
{
    public class GameRepository : IGameRepository
    {
        private readonly IMongoDatabase _mongoDatabase;

        public GameRepository(IMongoDatabase mongoDatabase)
        {
            _mongoDatabase = mongoDatabase;
        }

        private IMongoCollection<SteamGame> GetCollectionSteamData()
        {
            return _mongoDatabase.GetCollection<SteamGame>("SteamData");
        }

        private IMongoCollection<TwitchGame> GetCollectionTwitchData()
        {
            return _mongoDatabase.GetCollection<TwitchGame>("TwitchData");
        }

        public async Task<SteamAndTwitch> GetByGameIdAsync(string gameId)
        {
            var collectionSteam = GetCollectionSteamData();
            var collectionTwitch = GetCollectionTwitchData();

            SteamAndTwitch steamAndTwitch = new SteamAndTwitch();

            steamAndTwitch.steam = await collectionSteam.Find(model => model.GameId == gameId).FirstOrDefaultAsync();
            steamAndTwitch.twitch = await collectionTwitch.Find(model => model.GameName == steamAndTwitch.steam.GameName).FirstOrDefaultAsync();

            return steamAndTwitch;
        }

        public async Task<IEnumerable<GameListItem>> GetGameListAsync()
        {
            var collection = GetCollectionSteamData();
            var projection = Builders<SteamGame>.Projection.Include(g => g.GameId).Include(g => g.GameName);
            var games = await collection.Find(_ => true).Project<GameListItem>(projection).ToListAsync();
            return games;
        }

        public async Task<IEnumerable<object>> GetAllGameStatsAsync()
        {
            var collectionSteam = GetCollectionSteamData();
            var collectionTwitch = GetCollectionTwitchData();

            var steamGames = await collectionSteam.Find(_ => true).ToListAsync();
            var twitchGames = await collectionTwitch.Find(_ => true).ToListAsync();

            var twitchGameGenres = new Dictionary<string, List<string>>();

            foreach (var twitchGame in twitchGames)
            {
                var correspondingSteamGame = steamGames.FirstOrDefault(s => s.GameName == twitchGame.GameName);
                if (correspondingSteamGame != null)
                {
                    twitchGameGenres[twitchGame.GameName] = correspondingSteamGame.GameGenres;
                }
            }

            var dates = steamGames.SelectMany(game => game.GameStats.Select(stat => stat.Date))
                                  .Union(twitchGames.SelectMany(game => game.GameStats.Select(stat => stat.Date)))
                                  .Distinct()
                                  .OrderBy(date => date)
                                  .ToList();

            var result = dates.Select(date => new
            {
                date,
                genres = steamGames.SelectMany(steamGame => steamGame.GameGenres,
                                    (steamGame, genre) => new { genre, players = steamGame.GameStats.FirstOrDefault(stat => stat.Date == date)?.PlayersCount ?? 0, viewers = 0 })
                        .Union(twitchGames.Where(t => twitchGameGenres.ContainsKey(t.GameName))
                                          .SelectMany(twitchGame => twitchGameGenres[twitchGame.GameName],
                                                      (twitchGame, genre) => new { genre, players = 0, viewers = twitchGame.GameStats.FirstOrDefault(stat => stat.Date == date)?.Viewers ?? 0 }))
                        .GroupBy(g => g.genre)
                        .ToDictionary(
                            g => g.Key,
                            g => new
                            {
                                players = g.Sum(x => x.players),
                                viewers = g.Sum(t => t.viewers)
                            })
            });

            return result;
        }
    }
}
