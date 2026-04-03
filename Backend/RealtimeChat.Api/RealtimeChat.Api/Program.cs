using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using RealtimeChat.Api.Hubs;
using RealtimeChat.Api.Services;
using RealtimeChatApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container for building API controllers.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "RealtimeChat API",
        Version = "v1",
        Description = "ASP.NET Core API for real-time chat with sentiment analysis"
    });
});

// Configure Entity Framework Core to use Azure SQL Database.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlDbConnection")));

// Azure SignalR Service
builder.Services.AddSignalR()
    .AddAzureSignalR(builder.Configuration["AzureSignalR:ConnectionString"]!);

// Register the sentiment analysis service (Azure AI) as a Singleton.
builder.Services.AddSingleton<ISentimentService, SentimentService>();

// Configure CORS to allow the React frontend to communicate with this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy
            .WithOrigins(builder.Configuration["AllowedOrigins:Frontend"] ?? "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RealtimeChat API v1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/hubs/chat");

app.Run();
