using System;
using System.Collections.Generic;

namespace YourNamespace
{
    public static class BookStore
    {
        static BookStore()
        {
            // Initialize with some sample data for testing
            Books = new List<Book>
            {
                
                
            };
        }

        public static List<Book> Books { get; }
    }
}
