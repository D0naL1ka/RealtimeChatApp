using System;
using System.Collections.Generic;
using System.Text;

namespace RealtimeChatApp.Data.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Sentiment analysis
        public string? Sentiment { get; set; }
        public double? PositiveScore { get; set; }
        public double? NegativeScore { get; set; }
        public double? NeutralScore { get; set; }
    }
}
