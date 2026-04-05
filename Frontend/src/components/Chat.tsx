import { useEffect, useRef, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import './Chat.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface Message {
  id: number
  username: string
  text: string
  createdAt: string
  sentiment?: string
  positiveScore?: number
  negativeScore?: number
  neutralScore?: number
}

function getSentimentInfo(sentiment?: string) {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return { bg: '#dcf8c6', label: 'Positive' }
    case 'negative':
      return { bg: '#ffd9d9', label: 'Negative' }
    case 'mixed':
      return { bg: '#fff3cd', label: 'Mixed' }
    default:
      return { bg: '#ffffff', label: 'Neutral' }
  }
}

export default function Chat() {
  const [username, setUsername] = useState('')
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const join = async () => {
    if (!username.trim()) return
    setIsConnecting(true)
    setError('')

    try {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/hubs/chat`)
        .withAutomaticReconnect()
        .build()

      conn.on('ReceiveMessage', (message: Message) => {
        setMessages(prev => [...prev, message])
      })

      await conn.start()
      const history = await conn.invoke<Message[]>('GetHistory')
      setMessages(history)
      setConnection(conn)
      setJoined(true)
    } catch (e) {
      setError('Connection failed. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const sendMessage = async () => {
    if (!text.trim() || !connection) return
    await connection.invoke('SendMessage', username, text)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!joined) {
    return (
      <div className="join-container">
        <div className="join-box">
          <h1>Realtime Chat</h1>
          <input
            placeholder="Enter your name..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && join()}
          />
          {error && <span className="error">{error}</span>}
          <button onClick={join} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Join Chat'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-title">Realtime Chat</span>
        <span className="username-badge">{username}</span>
      </div>

      <div className="messages-list">
        {messages.map(msg => {
          const info = getSentimentInfo(msg.sentiment)
          const isMe = msg.username === username
          return (
            <div
              key={msg.id}
              className={`message ${isMe ? 'message-me' : 'message-other'}`}
              style={{ background: isMe ? '#dcf8c6' : '#ffffff' }}
            >
              <div className="message-header">
                <span className="message-author">{msg.username}</span>
                <span className="sentiment-badge">
                  {info.label}
                </span>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{msg.text}</div>
              <div className="sentiment-scores">
                Pos: {((msg.positiveScore ?? 0) * 100).toFixed(0)}%
                Neg: {((msg.negativeScore ?? 0) * 100).toFixed(0)}%
                Neu: {((msg.neutralScore ?? 0) * 100).toFixed(0)}%
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  )
}