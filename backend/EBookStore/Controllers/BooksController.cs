using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using YourNamespace;
using System.Linq;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> AddBook([FromForm] IFormFile file, [FromForm] string title, [FromForm] string author, [FromForm] string category, [FromForm] decimal price, [FromForm] string description, [FromForm] int availableCopies = 3)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided.");
            }

            var filePath = Path.Combine("wwwroot/assets", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var newBook = new Book
            {
                Id = Guid.NewGuid(),
                Title = title,
                Author = author,
                Category = category,
                //Price = price,
                Image = "/assets/" + file.FileName,
                AvailableCopies = availableCopies,
                Description = description
            };

            BookStore.Books.Add(newBook);
            return Ok(newBook);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromForm] IFormFile file, [FromForm] string title, [FromForm] string author, [FromForm] string category, [FromForm] string description, [FromForm] int availableCopies)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }

            // If a new image file is provided, handle the file upload and update the image
            if (file != null && file.Length > 0)
            {
                // Optionally, delete the old image
                var oldFilePath = Path.Combine("wwwroot/assets", Path.GetFileName(book.Image));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }

                // Save the new image file
                var newFilePath = Path.Combine("wwwroot/assets", file.FileName);
                using (var stream = new FileStream(newFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                book.Image = "/assets/" + file.FileName; // Update the image URL in the book object
            }

            // Update the rest of the book's fields
            book.Title = title;
            book.Author = author;
            book.Category = category;
            book.Description = description;
            book.AvailableCopies = availableCopies;

            return Ok(book);
        }


        [HttpGet("{id}")]
        public IActionResult GetBookById(Guid id)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpGet]
        public IActionResult GetBooks()
        {
            var totalPurchasedBooks = BookStore.Books.Sum(book => book.AvailableCopies);
            return Ok(new
            {
                Books = BookStore.Books,
                TotalPurchasedBooks = totalPurchasedBooks
            });
        }

        [HttpDelete("remove-by-title/{title}")]
        public IActionResult RemoveBookByTitle(string title)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Title.Equals(title, StringComparison.OrdinalIgnoreCase));
            if (book != null)
            {
                BookStore.Books.Remove(book);
                return Ok(book);
            }
            return NotFound();
        }


        [HttpGet("{id}/description")]
        public IActionResult GetBookDescription(Guid id)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book.Description);
        }

        [HttpGet("{id}/title")]
        public IActionResult GetBookTitle(Guid id)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book.Title);
        }

        [HttpGet("{id}/author")]
        public IActionResult GetBookAuthor(Guid id)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book.Author);
        }

        [HttpGet("{id}/category")]
        public IActionResult GetBookCategory(Guid id)
        {
            var book = BookStore.Books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book.Category);
        }

        [HttpPost("update-available-copies")]
        public IActionResult UpdateAvailableCopies([FromBody] UpdateCopiesRequest request)
        {
            var book = BookStore.Books.Find(b => b.Id == request.BookId);
            if (book != null)
            {
                if (book.AvailableCopies < request.AvailableCopies)
                {
                    return BadRequest("Insufficient copies available.");
                }
                book.AvailableCopies = request.AvailableCopies;
                return Ok(book);
            }
            return NotFound();
        }

    }

    public class UpdateCopiesRequest
    {
        public Guid BookId { get; set; }
        public int AvailableCopies { get; set; }
    }
}
