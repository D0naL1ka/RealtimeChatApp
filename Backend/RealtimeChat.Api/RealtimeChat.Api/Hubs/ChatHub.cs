using Microsoft.AspNetCore.SignalR;
using RealtimeChat.Api.Services;
using RealtimeChatApp.Data;
using RealtimeChatApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace RealtimeChat.Api.Hubs
{
    public class ChatHub: Hub
    {
        private readonly AppDbContext _context;
        private readonly ISentimentService _sentiment;

        private static readonly Dictionary<string, string> _onlineUsers = new();

        public ChatHub(AppDbContext context, ISentimentService sentiment)
        {
            _context = context;
            _sentiment = sentiment;
        }

        public async Task JoinChat(string username)
        {
            _onlineUsers[Context.ConnectionId] = username;
            await Clients.All.SendAsync("UpdateOnlineUsers", _onlineUsers.Values.Distinct().ToList());
        }

        public async Task SendMessage(string user, string text)
        {
            var (label, pos, neg, neu) = await _sentiment.AnalyzeAsync(text);

            var message = new ChatMessage
            {
                Username = user,
                Text = text,
                CreatedAt = DateTime.UtcNow,
                Sentiment = label,
                PositiveScore = pos,
                NegativeScore = neg,
                NeutralScore = neu
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            await Clients.All.SendAsync("ReceiveMessage", new
            {
                message.Id,
                message.Username,
                message.Text,
                message.CreatedAt,
                message.Sentiment,
                message.PositiveScore,
                message.NegativeScore,
                message.NeutralScore
            });
        }
        public async Task<object[]> GetHistory()
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.CreatedAt)
                .Take(50)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Username,
                    m.Text,
                    m.CreatedAt,
                    m.Sentiment,
                    m.PositiveScore,
                    m.NegativeScore,
                    m.NeutralScore
                })
                .ToListAsync();

            return messages.Cast<object>().ToArray();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _onlineUsers.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("UpdateOnlineUsers", _onlineUsers.Values.Distinct().ToList());
            await base.OnDisconnectedAsync(exception);
        }
    }
}
