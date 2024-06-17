using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjektASP_NET.Models
{
    public class SteamGame
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonElement("game_id")]
        public string GameId { get; set; }
        [BsonElement("game_name")]
        public string GameName { get; set; }
        [BsonElement("game_developers")]
        public List<string> GameDevelopers { get; set; }
        [BsonElement("game_genres")]
        public List<string> GameGenres { get; set; }
        [BsonElement("game_tags")]
        public List<string> GameTags { get; set; }
        [BsonElement("game_stats")]
        public List<GameStatSteam> GameStats { get; set; }
    }

    public class GameStatSteam
    {
        [BsonElement("date")]
        public string Date { get; set; }
        [BsonElement("players_count")]
        public int PlayersCount { get; set; }
    }
}
