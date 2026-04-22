'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './Chat.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTERS = [
  "I don't know where to start — my head is full",
  "Here's my list — help me figure out what actually matters today",
  "I feel like I'm behind on everything",
  "I only have an hour. What should I focus on?",
]

function formatLine(line: string, key: number) {
  // Parse **bold** within a line
  const parts = line.split(/(\*\*.*?\*\*)/)
  const formatted = parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j}>{part.slice(2, -2)}</strong>
    }
    return <span key={j}>{part}</span>
  })

  if (line.startsWith('💡') || line.startsWith('➕') || line.startsWith('🧺')) {
    return <p key={key} className={styles.sectionHeader}>{formatted}</p>
  }
  if (line.startsWith('→')) {
    return <p key={key} className={styles.focusLine}>{formatted}</p>
  }
  return <p key={key}>{formatted}</p>
}

function formatMessage(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.trim() === '') return <br key={i} />
    return formatLine(line, i)
  })
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, loading])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: data.error }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoMark}>🌿</div>
        <div className={styles.headerText}>
          <h1>Less Noise, More Focus</h1>
          <p>Reset your day — one thing at a time</p>
        </div>
        <div className={styles.breatheDot} />
      </header>

      {/* Chat */}
      <div className={styles.chat} ref={chatRef}>
        {/* Welcome card */}
        {messages.length === 0 && (
          <div className={styles.welcomeCard}>
            <div className={styles.eyebrow}>Your calm in the chaos</div>
            <h2>
              What&apos;s on your mind <em>right now?</em>
            </h2>
            <p>
              You don&apos;t need to have it together to start. Drop everything that&apos;s
              in your head — messy, unorganised, half-thought — and we&apos;ll find your
              one clear focus together.
            </p>
            <div className={styles.divider} />
            <div className={styles.chips}>
              {STARTERS.map((s) => (
                <button key={s} className={styles.chip} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : ''}`}
          >
            <div className={`${styles.avatar} ${msg.role === 'user' ? styles.userAvatar : styles.botAvatar}`}>
              {msg.role === 'user' ? 'You' : '🌿'}
            </div>
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className={styles.messageRow}>
            <div className={`${styles.avatar} ${styles.botAvatar}`}>🌿</div>
            <div className={`${styles.bubble} ${styles.botBubble}`}>
              <div className={styles.typing}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <footer className={styles.footer}>
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.input}
            placeholder="What's on your mind today…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className={styles.sendBtn}
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <div className={styles.hint}>Enter to send · Shift+Enter for new line</div>
      </footer>
    </div>
  )
}
