using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class CheckoutBook
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } // Remove manual assignment

    public string Title { get; set; }

    public string Author { get; set; }

    public string Image { get; set; }

    public int Quantity { get; set; }

    public string UserName { get; set; }

    public DateTime ReturnDate { get; set; }

    public DateTime BorrowedDate { get; set; }
}
