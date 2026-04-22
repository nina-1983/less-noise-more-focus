'use client'

import { useState, useRef, useEffect } from 'react'

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
  const parts = line.split(/(\*\*.*?\*\*)/)
  const formatted = parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j}>{part.slice(2, -2)}</strong>
    }
    return <span key={j}>{part}</span>
  })
  if (line.startsWith('💡') || line.startsWith('➕') || line.startsWith('🧺')) {
    return <p key={key} style={{ fontWeight: 600, color: '#7A8C76', marginTop: 10, fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}>{formatted}</p>
  }
  if (line.startsWith('→')) {
    return <p key={key} style={{ background: '#F2F7F0', borderLeft: '3px solid #7A8C76', borderRadius: '0 7px 7px 0', padding: '6px 11px', margin: '5px 0', fontSize: 13.5, fontFamily: "'Montserrat', sans-serif" }}>{formatted}</p>
  }
  return <p key={key} style={{ marginBottom: 5, fontFamily: "'Montserrat', sans-serif" }}>{formatted}</p>
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i) => {
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
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  function startAgain() {
    setMessages([])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
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
      setMessages([...newMessages, { role: 'assistant', content: data.error || data.reply }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const moss = '#7A8C76'
  const mossDark = '#5A7055'
  const ink = '#2C2925'
  const inkSoft = '#5A5550'
  const bg = '#F4F1EC'
  const surface = '#FDFCFA'
  const mist = '#EAE6DF'
  const border = '#E2DDD6'
  const sand = '#C4A882'
  const userBubble = '#3D3830'
  const font = "'Montserrat', sans-serif"

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', background: bg, fontFamily: font }}>

      {/* Header */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', maxWidth: 680, margin: '0 auto', width: '100%' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(145deg, ${moss}, ${mossDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🌿</div>
          <div>
            <div style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: ink, lineHeight: 1.2 }}>Less Noise, More Focus</div>
            <div style={{ fontFamily: font, fontSize: 11, color: moss, marginTop: 2, fontWeight: 400 }}>Reset your day — one thing at a time</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {messages.length > 0 && (
              <button onClick={startAgain} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, padding: '5px 12px', fontFamily: font, fontSize: 12, color: inkSoft, cursor: 'pointer', fontWeight: 500 }}>
                Start again
              </button>
            )}
            <div style={{ width: 7, height: 7, background: moss, borderRadius: '50%', animation: 'breathe 4s ease-in-out infinite', flexShrink: 0 }} />
          </div>
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', background: bg }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Welcome */}
          {messages.length === 0 && (
            <div style={{ background: '#FFFEFB', border: `1px solid ${border}`, borderRadius: 18, padding: 22, boxShadow: '0 2px 24px rgba(44,41,37,0.07)' }}>
              <div style={{ fontFamily: font, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: moss, marginBottom: 10 }}>Your calm in the chaos</div>
              <div style={{ fontFamily: font, fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 10, color: ink }}>
                What&apos;s on your mind <em style={{ fontStyle: 'italic', color: sand, fontWeight: 400 }}>right now?</em>
              </div>
              <div style={{ fontFamily: font, fontSize: 13.5, lineHeight: 1.75, color: inkSoft, marginBottom: 16, fontWeight: 400 }}>
                You don&apos;t need to have it together to start. Drop everything that&apos;s in your head — messy, unorganised, half-thought — and we&apos;ll find your one clear focus together.
              </div>
              <div style={{ height: 1, background: mist, marginBottom: 14 }} />
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => send(s)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontFamily: font, fontWeight: 400, color: inkSoft, cursor: 'pointer', textAlign: 'left' as const, lineHeight: 1.4, transition: 'all 0.18s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: msg.role === 'user' ? 9 : 14, marginTop: 2, background: msg.role === 'user' ? userBubble : `linear-gradient(145deg, ${moss}, ${mossDark})`, color: msg.role === 'user' ? bg : 'white', fontWeight: 700, fontFamily: font, letterSpacing: '0.02em' }}>
                {msg.role === 'user' ? 'You' : '🌿'}
              </div>
              <div style={{ maxWidth: '78%', padding: '11px 15px', borderRadius: 16, fontSize: 14, lineHeight: 1.7, fontFamily: font, fontWeight: 400, background: msg.role === 'user' ? userBubble : 'white', color: msg.role === 'user' ? '#F4F1EC' : ink, border: msg.role === 'user' ? 'none' : `1px solid ${border}`, borderBottomLeftRadius: msg.role === 'assistant' ? 5 : 16, borderBottomRightRadius: msg.role === 'user' ? 5 : 16, boxShadow: msg.role === 'assistant' ? '0 2px 24px rgba(44,41,37,0.07)' : 'none' }}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}

          {/* Typing */}
          {loading && (
            <div style={{ display: 'flex', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginTop: 2, background: `linear-gradient(145deg, ${moss}, ${mossDark})` }}>🌿</div>
              <div style={{ padding: '14px 16px', borderRadius: 16, borderBottomLeftRadius: 5, background: 'white', border: `1px solid ${border}`, boxShadow: '0 2px 24px rgba(44,41,37,0.07)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{ width: 6, height: 6, background: moss, borderRadius: '50%', display: 'inline-block', animation: `dot 1.4s ${delay}s infinite` }} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div style={{ background: surface, borderTop: `1px solid ${border}`, flexShrink: 0 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 20px 16px' }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              placeholder="What's on your mind today…"
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize() }}
              onKeyDown={handleKey}
              rows={1}
              style={{ flex: 1, background: mist, border: `1px solid ${border}`, borderRadius: 12, padding: '11px 15px', fontFamily: font, fontSize: 14, color: ink, resize: 'none', lineHeight: 1.5, minHeight: 46, maxHeight: 150, overflowY: 'auto', outline: 'none', fontWeight: 400 }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: 11, background: loading || !input.trim() ? '#B8C4B6' : moss, border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.18s' }}
            >
              <svg viewBox="0 0 24 24" fill="white" width={16} height={16}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#C0B8AF', marginTop: 7, fontFamily: font }}>Enter to send · Shift+Enter for new line</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        @keyframes breathe { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.35); } }
        @keyframes dot { 0%,60%,100% { transform:translateY(0); opacity:0.4; } 30% { transform:translateY(-5px); opacity:1; } }
        textarea:focus { border-color: #7A8C76 !important; background: #FFFEFB !important; }
        textarea::placeholder { color: #B8B2AA; font-family: 'Montserrat', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E2DDD6; border-radius: 4px; }
      `}</style>
    </div>
  )
}
