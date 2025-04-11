using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Runtime.ConstrainedExecution;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly IMongoCollection<Book> _booksCollection;
    private readonly UserService _userService;
    private readonly IConfiguration _configuration;
    private readonly IMongoCollection<CheckoutBook> _checkoutBooksCollection;
    public BooksController(IMongoCollection<Book> booksCollection, IMongoCollection<CheckoutBook> checkoutBooksCollection, UserService userService, IConfiguration configuration)
    {
        _booksCollection = booksCollection;
        _userService = userService;
        _configuration= configuration;
        _checkoutBooksCollection = checkoutBooksCollection;
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _userService.RegisterUser(request.Email, request.Password);
        var user = await _userService.GetUserByEmail(request.Email);
        return Ok(new { message = result, role = user?.Role });
    }



    public class RegisterRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
// GET: api/books
[HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        var books = await _booksCollection.Find(book => true).ToListAsync();
        var totalPurchasedBooks = books.Sum(book => book.AvailableCopies);

        return Ok(new
        {
            Books = books,
            TotalPurchasedBooks = totalPurchasedBooks,
            AdminUsers= _configuration.GetSection("AdminUsers").Get<string[]>()?.ToList()
        });
    }

    // GET: api/books/{id}
    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetBook(string id)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();
        return Ok(book);
    }

    //// POST: api/books
    //[HttpPost]
    //public async Task<IActionResult> AddBook([FromForm] IFormFile file, [FromForm] string title, [FromForm] string author, [FromForm] string category, [FromForm] decimal price, [FromForm] string description, [FromForm] string ISBN, [FromForm] int availableCopies = 3)
    //{
    //    Console.WriteLine($"Received: Title={title}, Author={author}, Price={price}, ISBN={ISBN}");

    //    if (file == null || file.Length == 0)
    //        return BadRequest("No file provided.");

    //    var filePath = Path.Combine("wwwroot/assets", file.FileName);
    //    using (var stream = new FileStream(filePath, FileMode.Create))
    //    {
    //        await file.CopyToAsync(stream);
    //    }

    //    var newBook = new Book
    //    {
    //        Title = title,
    //        Author = author,
    //        Category = category,
    //        Price = price,
    //        Image = "/assets/" + file.FileName,
    //        AvailableCopies = availableCopies,
    //        Description = description,
    //        ISBN = ISBN
    //    };

    //    await _booksCollection.InsertOneAsync(newBook);
    //    return CreatedAtAction(nameof(GetBook), new { id = newBook.Id }, newBook);
    //}

    [HttpPost]
    public async Task<IActionResult> AddBook([FromForm] IFormFile file,
                                           [FromForm] string title,
                                           [FromForm] string author,
                                           [FromForm] string category,
                                           [FromForm] decimal price,
                                           [FromForm] string description,
                                           [FromForm] string? ISBN,
                                           [FromForm] int availableCopies
                                           )
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided.");

        var filePath = Path.Combine("wwwroot/assets", file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

  
        var newBook = new Book
        {
            Title = title,
            Author = author,
            Category = category,
            Price = price,
            Image = "/assets/" + file.FileName,
            AvailableCopies = availableCopies,
            Description = description,
            ISBN = ISBN,
            
        };

        await _booksCollection.InsertOneAsync(newBook);

        // Return book + user role
        return CreatedAtAction(nameof(GetBook), new { id = newBook.Id }, new
        {
            Book = newBook,
        });
    }


    [HttpPost("checkout")]
    public async Task<IActionResult> CheckoutBooks([FromBody] List<CheckoutBook> books)
    {
        if (books == null || !books.Any()) return BadRequest("No books provided");
        for (int i = 0; i < books.Count; i++)
        {
            await _checkoutBooksCollection.InsertOneAsync(books[i]);
        }
        
          
        
        
        return Ok(new { message = "Books checked out successfully!" });
    }


    [HttpGet("checkout/{username}")]
    public async Task<IActionResult> GetCheckoutBooks(string username)
    {
        var adminUsers = _configuration.GetSection("AdminUsers").Get<string[]>()?.ToList();
        bool isAdmin = adminUsers != null && adminUsers.Contains(username);

        List<CheckoutBook> books;
        if (isAdmin)
        {
            books = await _checkoutBooksCollection.Find(_ => true).ToListAsync(); 
        }
        else
        {
            books = await _checkoutBooksCollection.Find(cb => cb.UserName == username).ToListAsync();
        }

        return Ok(books); 
    }









    // PUT: api/books/{id}
    //[HttpPut("{id:length(24)}")]
    //public async Task<IActionResult> UpdateBook(string id, [FromForm] IFormFile file, [FromForm] string title, [FromForm] string author, [FromForm] string category, [FromForm] string description, [FromForm] string isbn, [FromForm] int availableCopies)
    //{
    //    var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
    //    if (book == null)
    //        return NotFound();

    //    if (file != null && file.Length > 0)
    //    {
    //        var oldFilePath = Path.Combine("wwwroot/assets", Path.GetFileName(book.Image));
    //        if (System.IO.File.Exists(oldFilePath))
    //            System.IO.File.Delete(oldFilePath);

    //        var newFilePath = Path.Combine("wwwroot/assets", file.FileName);
    //        using (var stream = new FileStream(newFilePath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }

    //        book.Image = "/assets/" + file.FileName;
    //    }

    //    book.Title = title;
    //    book.Author = author;
    //    book.Category = category;
    //    book.Description = description;
    //    book.AvailableCopies = availableCopies;
    //    book.ISBN = isbn;

    //    var result = await _booksCollection.ReplaceOneAsync(b => b.Id == id, book);
    //    if (result.MatchedCount == 0) return NotFound();

    //    return Ok(book);
    //}


    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> UpdateBook(string id, [FromForm] string title, [FromForm] string author, [FromForm] string category, [FromForm] string description, [FromForm] string? isbn, [FromForm] int availableCopies, [FromForm] IFormFile file = null)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null)
            return NotFound();


        Console.WriteLine(book);
        //var user = await _userService.GetUserByEmail(userEmail);
        //if (user == null)
        //    return Unauthorized("User not found.");

        //if (user.Role != "admin" && book.CreatedBy != userEmail)
        //    return Forbid("You can only edit your own books.");

        if (file != null && file.Length > 0)
        {
            var oldFilePath = Path.Combine("wwwroot/assets", Path.GetFileName(book.Image));
            if (System.IO.File.Exists(oldFilePath))
                System.IO.File.Delete(oldFilePath);

            var newFilePath = Path.Combine("wwwroot/assets", file.FileName);
            using (var stream = new FileStream(newFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            book.Image = "/assets/" + file.FileName;
        }

        book.Title = title;
        book.Author = author;
        book.Category = category;
        book.Description = description;
        book.AvailableCopies = availableCopies;
        book.ISBN = isbn;
       
        var result = await _booksCollection.ReplaceOneAsync(b => b.Id == id, book);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(book);
    }

    // DELETE: api/books/{id}
    //[HttpDelete("{id:length(24)}")]
    //public async Task<IActionResult> DeleteBook(string id)
    //{
    //    var result = await _booksCollection.DeleteOneAsync(b => b.Id == id);
    //    if (result.DeletedCount == 0) return NotFound();
    //    return NoContent();
    //}


    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> DeleteBook(string id, [FromQuery] string userEmail)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();

        var user = await _userService.GetUserByEmail(userEmail);
        if (user == null) return Unauthorized("User not found.");

        if (user.Role != "admin" && book.CreatedBy != userEmail)
            return Forbid("You can only delete your own books.");

        var result = await _booksCollection.DeleteOneAsync(b => b.Id == id);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }

    // DELETE: api/books/remove-by-title/{title}
    [HttpDelete("remove-by-title/{title}")]
    public async Task<IActionResult> RemoveBookByTitle(string title)
    {
        var result = await _booksCollection.DeleteOneAsync(b => b.Title == title);
        if (result.DeletedCount == 0) return NotFound();
        return Ok($"Book with title '{title}' removed.");
    }

    // GET: api/books/{id}/description
    [HttpGet("{id:length(24)}/description")]
    public async Task<IActionResult> GetBookDescription(string id)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();
        return Ok(book.Description);
    }

    // GET: api/books/{id}/title
    [HttpGet("{id:length(24)}/title")]
    public async Task<IActionResult> GetBookTitle(string id)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();
        return Ok(book.Title);
    }

    // GET: api/books/{id}/author
    [HttpGet("{id:length(24)}/author")]
    public async Task<IActionResult> GetBookAuthor(string id)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();
        return Ok(book.Author);
    }

    // GET: api/books/{id}/category
    [HttpGet("{id:length(24)}/category")]
    public async Task<IActionResult> GetBookCategory(string id)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();
        return Ok(book.Category);
    }

    // GET: api/books/{id}/image
    [HttpGet("{id:length(24)}/image")]
    public async Task<IActionResult> GetBookImage(string id)
    {
        var book = await _booksCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        if (book == null) return NotFound();
        return Ok(book.Image);
    }

    // POST: api/books/update-available-copies
    [HttpPost("update-available-copies")]
    public async Task<IActionResult> UpdateAvailableCopies([FromBody] UpdateCopiesRequest request)
    {
        var book = await _booksCollection.Find(b => b.Id == request.BookId).FirstOrDefaultAsync();
        if (book != null)
        {
            if (book.AvailableCopies < request.AvailableCopies)
                return BadRequest("Insufficient copies available.");

            book.AvailableCopies = request.AvailableCopies;
            await _booksCollection.ReplaceOneAsync(b => b.Id == request.BookId, book);
            return Ok(book);
        }
        return NotFound();
    }
}

// DTO for updating available copies
public class UpdateCopiesRequest
{
    public string BookId { get; set; } = string.Empty;  // Ensure it has a default value
    public int AvailableCopies { get; set; }
}

