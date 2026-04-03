using Microsoft.EntityFrameworkCore;
using RealtimeChat.Api.Hubs;
using RealtimeChat.Api.Services;
using RealtimeChatApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container for building API controllers.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure Entity Framework Core to use Azure SQL Database.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlDbConnection")));

// Register the sentiment analysis service (Azure AI) as a Singleton.
builder.Services.AddSingleton<ISentimentService, SentimentService>();

// Configure CORS to allow the React frontend to communicate with this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy
            .WithOrigins(builder.Configuration["AllowedOrigins:Frontend"] ?? "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
