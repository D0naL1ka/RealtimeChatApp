import { useRef, useState } from 'react'
import { Smile, Send } from 'lucide-react'
import EmojiPicker, { type EmojiClickData, EmojiStyle } from 'emoji-picker-react'

interface Props {
  onSend: (text: string) => void
}

export default function InputArea({ onSend }: Props) {
  const [text, setText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const send = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
    setShowEmojiPicker(false)
  }

  return (
    <div className="input-area">
      <div className="input-wrapper" ref={emojiPickerRef}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Write a message..."
        />
        <button
          className="emoji-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile size={22} />
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={(d: EmojiClickData) => setText(t => t + d.emoji)}
              emojiStyle={EmojiStyle.NATIVE}
              width="100%"
            />
          </div>
        )}
      </div>
      <button className="send-btn" onClick={send}>
        <Send size={20} />
      </button>
    </div>
  )
}