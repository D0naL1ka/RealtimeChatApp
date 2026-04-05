import { Users } from 'lucide-react'
interface Props {
  onlineUsers: string[]
}

export default function Sidebar({ onlineUsers }: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Users size={18} />
        <span>Active Users</span>
        <span className="online-count">{onlineUsers.length}</span>
      </div>
      <div className="users-list">
        {onlineUsers.map(user => (
          <div key={user} className="user-item">
            <div className="user-avatar">
              {user.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user}</span>
              <span className="user-status">
                <span className="online-dot" />
                online
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}