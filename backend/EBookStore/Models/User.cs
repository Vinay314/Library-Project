using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } // MongoDB Unique ID

    [BsonElement("email")]
    public required string Email { get; set; } // Unique email

    [BsonElement("passwordHash")]
    public required string PasswordHash { get; set; } // Hashed password

    [BsonElement("role")]
    public string Role { get; set; } = "user"; // Default is a normal user
}
