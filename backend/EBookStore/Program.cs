using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Configure MongoDB
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(builder.Configuration.GetValue<string>("ConnectionStrings:MongoDb")));

builder.Services.AddScoped<IMongoDatabase>(s =>
{
    var settings = s.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var client = s.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});

builder.Services.AddScoped<IMongoCollection<Book>>(s =>
{
    var settings = s.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var database = s.GetRequiredService<IMongoDatabase>();
    return database.GetCollection<Book>(settings.BooksCollectionName);
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();
