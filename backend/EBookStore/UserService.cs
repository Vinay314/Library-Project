using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;  // Required for List<T>
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;

public class UserService
{
    private readonly IMongoCollection<User> _users;
    private readonly List<string> _adminEmails;

    public UserService(IConfiguration configuration, IMongoDatabase database)
    {
        //_users = database.GetCollection<User>("users");

        // Load admin emails from configuration
        _adminEmails = configuration.GetSection("AdminUsers").Get<string[]>()?.ToList() ?? new List<string>();
    }

    public async Task<string> RegisterUser(string email, string password)
    {
        var existingUser = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        if (existingUser != null)
        {
            return "Email already exists";
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var newUser = new User
        {
            Email = email,
            PasswordHash = hashedPassword,
            Role = _adminEmails.Contains(email) ? "admin" : "user" // Set role based on admin emails
        };

        await _users.InsertOneAsync(newUser);
        return "User registered successfully";
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }
}
