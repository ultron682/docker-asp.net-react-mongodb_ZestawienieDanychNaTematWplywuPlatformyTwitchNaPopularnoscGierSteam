using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.RegularExpressions;
using ProjektASP_NET.Models;

namespace ProjektASP_NET
{
    internal class ImportData
    {
        private readonly IMongoDatabase _mongoDatabase;
        public ImportData(IMongoDatabase mongoDatabase)
        {
            _mongoDatabase = mongoDatabase;
        }

        // Pomaga oddzielać pola w plikach CSV
        private static readonly Regex CsvSplitRegex = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))", RegexOptions.Compiled);

        private Dictionary<string, string> ImportGamesName()
        {
            string path = "data/applicationInformation.csv";
            Dictionary<string, string> gameData = new Dictionary<string, string>();

            using (StreamReader sr = new StreamReader(path))
            {
                sr.ReadLine();
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] parts = CsvSplitRegex.Split(line);
                    gameData[parts[0]] = parts[2];
                }
            }

            return gameData;
        }

        private Dictionary<string, List<string>> ImportGamesDevelopers()
        {
            string path = "data/applicationDevelopers.csv";
            Dictionary<string, List<string>> developerData = new Dictionary<string, List<string>>();

            using (StreamReader sr = new StreamReader(path))
            {
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] parts = CsvSplitRegex.Split(line);
                    developerData[parts[0]] = parts.Skip(1).ToList();
                }
            }

            return developerData;
        }

        private Dictionary<string, List<string>> ImportGamesGenres()
        {
            string path = "data/applicationGenres.csv";
            Dictionary<string, List<string>> genresData = new Dictionary<string, List<string>>();
            using (StreamReader sr = new StreamReader(path))
            {
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] parts = CsvSplitRegex.Split(line);
                    genresData[parts[0]] = parts.Skip(1).ToList();
                }
            }

            return genresData;
        }

        private Dictionary<string, List<string>> ImportGamesTags()
        {
            string path = "data/applicationTags.csv";
            Dictionary<string, List<string>> tagsData = new Dictionary<string, List<string>>();

            using (StreamReader sr = new StreamReader(path))
            {
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] parts = CsvSplitRegex.Split(line);
                    tagsData[parts[0]] = parts.Skip(1).ToList();
                }
            }

            return tagsData;
        }

        private List<GameStatSteam> ImportGameStats(string path)
        {
            var dateToMaxPlayers = new Dictionary<string, int>();

            using (StreamReader sr = new StreamReader(path))
            {
                sr.ReadLine();
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] parts = line.Split(',');
                    string date = DateTime.Parse(parts[0]).Date.ToString("yyyy-MM-dd");
                    int value = string.IsNullOrEmpty(parts[1]) ? 0 : int.Parse(parts[1]);

                    if (dateToMaxPlayers.TryGetValue(date, out int existingValue))
                    {
                        if (value > existingValue)
                        {
                            dateToMaxPlayers[date] = value;
                        }
                    }
                    else
                    {
                        dateToMaxPlayers[date] = value;
                    }
                }
            }

            return dateToMaxPlayers.Select(kvp => new GameStatSteam { Date = kvp.Key, PlayersCount = kvp.Value }).ToList();
        }

        private string[] GetFileNames()
        {
            string folderPath = "data/games";
            return Directory.GetFiles(folderPath);
        }

        private async Task AddGamesFromSteam()
        {

            var collection = _mongoDatabase.GetCollection<SteamGame>("SteamData");
            var twitchCollection = _mongoDatabase.GetCollection<TwitchGame>("TwitchData");

            Dictionary<string, string> gameNames = ImportGamesName();
            Dictionary<string, List<string>> gameDevelopers = ImportGamesDevelopers();
            Dictionary<string, List<string>> gameGenres = ImportGamesGenres();
            Dictionary<string, List<string>> gameTags = ImportGamesTags();
            string[] filenames = GetFileNames();

            List<SteamGame> gamesToInsert = new List<SteamGame>();
            foreach (var filename in filenames)
            {
                string gameId = Path.GetFileNameWithoutExtension(filename);
                if (!gameNames.TryGetValue(gameId, out string gameName))
                {
                    continue;
                }

                var filter = Builders<TwitchGame>.Filter.Eq("game_name", gameName);
                var result = await twitchCollection.Find(filter).FirstOrDefaultAsync();
                if (result == null)
                {
                    continue;
                }

                List<GameStatSteam> gameStats = ImportGameStats(filename);

                var gameData = new SteamGame
                {
                    GameId = gameId,
                    GameName = gameName,
                    GameDevelopers = gameDevelopers.TryGetValue(gameId, out var developers) ? developers : new List<string>(),
                    GameGenres = gameGenres.TryGetValue(gameId, out var genres) ? genres : new List<string>(),
                    GameTags = gameTags.TryGetValue(gameId, out var tags) ? tags : new List<string>(),
                    GameStats = gameStats
                };

                gamesToInsert.Add(gameData);

                if (gamesToInsert.Count >= 100)
                {
                    await collection.InsertManyAsync(gamesToInsert);
                    gamesToInsert.Clear();
                }
            }

            if (gamesToInsert.Count > 0)
            {
                await collection.InsertManyAsync(gamesToInsert);
            }
        }

        private Dictionary<string, List<GameStatTwitch>> ImportTwitchData()
        {
            string path = "data/Twitch_game_data.csv";
            var gameData = new Dictionary<string, List<Tuple<string, int>>>();

            using (StreamReader sr = new StreamReader(path))
            {
                sr.ReadLine();
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] parts = CsvSplitRegex.Split(line);
                    string game = parts[1].Replace("\"", "");
                    string month = parts[2].Replace("\"", "");
                    string year = parts[3].Replace("\"", "");
                    int viewers = int.Parse(parts[6]);

                    if (!gameData.TryGetValue(game, out var dateViewers))
                    {
                        dateViewers = new List<Tuple<string, int>>();
                        gameData[game] = dateViewers;
                    }

                    dateViewers.Add(new Tuple<string, int>(year + "/" + month, viewers));
                }
            }

            var result = new Dictionary<string, List<GameStatTwitch>>();
            foreach (var kvp in gameData)
            {
                if (kvp.Value.Count == 33)
                {
                    var twitchStats = new List<GameStatTwitch>();
                    foreach (var t in kvp.Value)
                    {
                        int year = int.Parse(t.Item1.Split('/')[0]);
                        int month = int.Parse(t.Item1.Split('/')[1]);
                        int daysInMonth = DateTime.DaysInMonth(year, month);
                        int startDay = (t.Item1 == "2017/12") ? 14 : 1;
                        int endDay = (t.Item1 == "2020/08") ? 12 : daysInMonth;

                        for (int i = startDay; i <= endDay; i++)
                        {
                            string date = $"{year}-{month:D2}-{i:D2}";
                            twitchStats.Add(new GameStatTwitch { Date = date, Viewers = t.Item2 });
                        }
                    }
                    result[kvp.Key] = twitchStats;
                }
            }

            return result;
        }

        private async Task AddGamesFromTwitch()
        {
            Dictionary<string, List<GameStatTwitch>> games = ImportTwitchData();
            var collection = _mongoDatabase.GetCollection<TwitchGame>("TwitchData");

            List<TwitchGame> gamesToInsert = new List<TwitchGame>();

            try
            {
                foreach (var game in games)
                {
                    var gameData = new TwitchGame
                    {
                        GameName = game.Key,
                        GameStats = game.Value
                    };

                    gamesToInsert.Add(gameData);

                    if (gamesToInsert.Count >= 100)
                    {
                        await collection.InsertManyAsync(gamesToInsert);
                        gamesToInsert.Clear();
                    }
                }

                if (gamesToInsert.Count > 0)
                {
                    await collection.InsertManyAsync(gamesToInsert);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error inserting Twitch data: {e.Message}");
            }
        }

        public async Task InitData()
        {
            var collection = _mongoDatabase.GetCollection<BsonDocument>("Initialization");

            var collectionNames = await _mongoDatabase.ListCollectionNames().ToListAsync();

            var filter = Builders<BsonDocument>.Filter.Eq("_id", "init_lock");
            var update = Builders<BsonDocument>.Update.Set("locked", true);
            var options = new FindOneAndUpdateOptions<BsonDocument> { IsUpsert = true };
            var result = await collection.FindOneAndUpdateAsync(filter, update, options);

            if (result == null || !result.GetValue("locked", false).AsBoolean)
            {
                try
                {
                    if (!collectionNames.Contains("TwitchData"))
                    {
                        await AddGamesFromTwitch();
                    }

                    if (!collectionNames.Contains("SteamData"))
                    {
                        await AddGamesFromSteam();
                    }
                }
                finally
                {
                    var unlockUpdate = Builders<BsonDocument>.Update.Set("locked", false);
                    await collection.UpdateOneAsync(filter, unlockUpdate);
                }
            }
        }
    }
}
