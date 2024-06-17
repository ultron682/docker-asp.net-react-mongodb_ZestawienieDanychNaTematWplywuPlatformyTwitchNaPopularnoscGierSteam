using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProjektASP_NET.Models
{
    public class GameListItem
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonElement("game_id")]
        public string GameId { get; set; }
        [BsonElement("game_name")]
        public string GameName { get; set; }
    }
}
