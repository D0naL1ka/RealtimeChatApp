import { useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { MessageCircleHeart } from 'lucide-react'
import Sidebar from './Sidebar'
import MessageList from './MessageList'
import InputArea from './InputArea'
import type { Message } from '../types'
import './Chat.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Chat() {
  const [username, setUsername] = useState('')
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const join = async () => {
    if (!username.trim()) return
    setIsConnecting(true)
    try {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/hubs/chat`)
        .withAutomaticReconnect()
        .build()

      conn.on('ReceiveMessage', (m: Message) => {
        setMessages(prev => [...prev, m])
      })

      conn.on('UpdateOnlineUsers', (users: string[]) => {
        setOnlineUsers(users)
      })

      await conn.start()
      await conn.invoke('JoinChat', username)
      setMessages(await conn.invoke<Message[]>('GetHistory'))
      setConnection(conn)
      setJoined(true)
    } catch {
      alert('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const sendMessage = async (text: string) => {
    if (!connection) return
    await connection.invoke('SendMessage', username, text)
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
    <div className="app-layout">
      <Sidebar onlineUsers={onlineUsers} />
      <div className="chat-container">
        <div className="chat-header">
          <span className="chat-title">Realtime Chat</span>
          <span className="username-badge">{username}</span>
        </div>
        <MessageList messages={messages} username={username} />
        <InputArea onSend={sendMessage} />
      </div>
    </div>
  )
}