using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ProjektASP_NET.Models
{
    public class TwitchGame
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonElement("game_name")]
        public string GameName { get; set; }
        [BsonElement("game_stats")]
        public List<GameStatTwitch> GameStats { get; set; }
    }

    public class GameStatTwitch
    {
        [BsonElement("date")]
        public string Date { get; set; }
        [BsonElement("viewers")]
        public int Viewers { get; set; }
    }
}
