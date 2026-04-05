import { useEffect, useRef } from 'react'
import { Smile, Frown, Meh } from 'lucide-react'
import type { Message } from '../types'

const SCORE_ROWS = [
  { Icon: Smile, key: 'positiveScore' as const, color: '#16a34a' },
  { Icon: Frown, key: 'negativeScore' as const, color: '#dc2626' },
  { Icon: Meh,   key: 'neutralScore'  as const, color: '#64748b' },
]

interface Props {
  messages: Message[]
  username: string
}

export default function MessageList({ messages, username }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="messages-list">
      {messages.map(msg => {
        const isMe = msg.username === username
        return (
          <div
            key={msg.id}
            className={`message ${isMe ? 'message-me' : 'message-other'} message-${msg.sentiment?.toLowerCase() || 'neutral'}`}
          >
            <div className="message-header">
              <span className="message-author">{msg.username}</span>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="message-text">{msg.text}</div>
            <div className="sentiment-scores">
              {SCORE_ROWS.map(({ Icon, key, color }) => (
                <span key={key} className="score-item" style={{ color }}>
                  <Icon size={12} /> {((msg[key] ?? 0) * 100).toFixed(0)}%
                </span>
              ))}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}