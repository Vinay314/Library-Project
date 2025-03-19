public class Book
{
	public Guid Id { get; set; }
	public string Title { get; set; } = string.Empty; 
	public string Author { get; set; } = string.Empty; // Initialize with default value
	public string Category { get; set; } = string.Empty; // Initialize with default value
	//public decimal Price { get; set; }
	public string Image { get; set; } = string.Empty; // Initialize with default value
	public int AvailableCopies { get; set; } = 3; // Initialize with default value of 3
	public string Description {get; set; }=string.Empty;
	public string ISBN { get; set; } = string.Empty;
}
