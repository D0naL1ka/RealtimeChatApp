using Microsoft.AspNetCore.Mvc;
using RealtimeChatApp.Data;
using Microsoft.EntityFrameworkCore;

namespace RealtimeChat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>Повертає останні N повідомлень (для завантаження історії)</summary>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int count = 50)
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.CreatedAt)
                .Take(count)
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

            return Ok(messages);
        }
    }
}
