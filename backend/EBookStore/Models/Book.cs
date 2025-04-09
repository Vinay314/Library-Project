using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } // Remove manual assignment

    [BsonElement("title")]
    public required string Title { get; set; }

    [BsonElement("author")]
    public required string Author { get; set; }

    [BsonElement("category")]
    public required string Category { get; set; }

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("description")]
    public required string Description { get; set; }

    [BsonElement("ISBN")]
    public required string ISBN { get; set; }

    [BsonElement("availableCopies")]
    public int AvailableCopies { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("createdBy")]
    public string CreatedBy { get; set; } // Stores the email or user ID of the creator
}

