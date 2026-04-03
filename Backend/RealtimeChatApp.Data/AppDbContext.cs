using Microsoft.EntityFrameworkCore;
using RealtimeChatApp.Data.Models;

namespace RealtimeChatApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<ChatMessage> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username)
                      .HasMaxLength(100)
                      .IsRequired();
                entity.Property(e => e.Text)
                      .HasMaxLength(2000)
                      .IsRequired();
                entity.Property(e => e.Sentiment)
                      .HasMaxLength(20);
            });
        }
    }
}