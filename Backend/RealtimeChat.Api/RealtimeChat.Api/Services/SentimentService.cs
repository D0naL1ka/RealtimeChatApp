using Azure;
using Azure.AI.TextAnalytics;

namespace RealtimeChat.Api.Services
{
    public interface ISentimentService
    {
        Task<(string label, double pos, double neg, double neu)> AnalyzeAsync(string text);
    }

    public class SentimentService : ISentimentService
    {
        private readonly TextAnalyticsClient _client;

        public SentimentService(IConfiguration config)
        {
            var endpoint = config["AzureAI:Endpoint"]!;
            var key = config["AzureAI:ApiKey"]!;
            _client = new TextAnalyticsClient(new Uri(endpoint), new AzureKeyCredential(key));
        }

        public async Task<(string label, double pos, double neg, double neu)> AnalyzeAsync(string text)
        {
            var result = await _client.AnalyzeSentimentAsync(text);
            var s = result.Value;
            return (
                s.Sentiment.ToString(),
                s.ConfidenceScores.Positive,
                s.ConfidenceScores.Negative,
                s.ConfidenceScores.Neutral
            );
        }
    }
}
