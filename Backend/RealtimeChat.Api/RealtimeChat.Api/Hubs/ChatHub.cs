using Microsoft.AspNetCore.SignalR;
using RealtimeChat.Api.Services;
using RealtimeChatApp.Data;
using RealtimeChatApp.Data.Models;

namespace RealtimeChat.Api.Hubs
{
    public class ChatHub: Hub
    {
        private readonly AppDbContext _context;
        private readonly ISentimentService _sentiment;

        public ChatHub(AppDbContext context, ISentimentService sentiment)
        {
            _context = context;
            _sentiment = sentiment;
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
            await Clients.All.SendAsync("ReceiveMessage", user, text, message.CreatedAt, label, pos, neg, neu);
        }
    }
}
