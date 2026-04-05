import { useEffect, useRef, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import EmojiPicker, { type EmojiClickData, EmojiStyle } from 'emoji-picker-react'
import { Smile, Frown, Meh, Send, MessageCircleHeart } from 'lucide-react'
import './Chat.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface Message {
  id: number; username: string; text: string; createdAt: string;
  sentiment?: string; positiveScore?: number; negativeScore?: number; neutralScore?: number;
}

const SCORE_ROWS = [
  { Icon: Smile, key: 'positiveScore' as const, color: '#16a34a' },
  { Icon: Frown, key: 'negativeScore' as const, color: '#dc2626' },
  { Icon: Meh,   key: 'neutralScore'  as const, color: '#64748b' },
]

export default function Chat() {
  const [username, setUsername] = useState('')
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const join = async () => {
    if (!username.trim()) return
    setIsConnecting(true)
    try {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/hubs/chat`)
        .withAutomaticReconnect()
        .build()

      conn.on('ReceiveMessage', (m: Message) => setMessages(prev => [...prev, m]))
      await conn.start()
      setMessages(await conn.invoke<Message[]>('GetHistory'))
      setConnection(conn)
      setJoined(true)
    } catch {
      alert('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const sendMessage = async () => {
    if (!text.trim() || !connection) return
    await connection.invoke('SendMessage', username, text)
    setText('')
    setShowEmojiPicker(false)
  }

  if (!joined) return (
    <div className="join-container">
      <div className="join-box">
        <MessageCircleHeart size={40} color="#128c7e" />
        <h1>Realtime Chat</h1>
        <input 
          placeholder="Enter your name..." 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && join()}
        />
        <button onClick={join} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Join Chat'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-title">Realtime Chat</span>
        <span className="username-badge">{username}</span>
      </div>

      <div className="messages-list">
        {messages.map(msg => {
          const isMe = msg.username === username
          return (
            <div key={msg.id} className={`message ${isMe ? 'message-me' : 'message-other'} message-${msg.sentiment?.toLowerCase() || 'neutral'}`}>
              <div className="message-header">
                <span className="message-author">{msg.username}</span>
                <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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

      <div className="input-area">
        <div className="input-wrapper" ref={emojiPickerRef}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Write a message..." />
          <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile size={22} /></button>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={(d: EmojiClickData) => setText(t => t + d.emoji)} emojiStyle={EmojiStyle.NATIVE} width="100%" />
            </div>
          )}
        </div>
        <button className="send-btn" onClick={sendMessage}><Send size={20} /></button>
      </div>
    </div>
  )
}