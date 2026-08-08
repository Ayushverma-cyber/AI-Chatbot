import { useEffect, useRef, useState } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL
  const bottomRef = useRef(null)

  // Load saved chat history on first visit
  useEffect(() => {
    const saved = localStorage.getItem('chat-history')

    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      setMessages([
        {
          role: 'ai',
          text: '👋 Hi! I am your Gemini AI assistant. Ask me anything.',
        },
      ])
    }
  }, [])

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-history', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
  if (!message.trim()) return

  const currentMessage = message

  const userMessage = {
    role: 'user',
    text: currentMessage,
  }

  setMessages((prev) => [...prev, userMessage])
  setMessage('')
  setLoading(true)

  // Add empty AI message first
  let aiIndex

  setMessages((prev) => {
    aiIndex = prev.length + 1
    return [...prev, { role: 'ai', text: '' }]
  })

  try {
    const response = await fetch(`${API_URL}/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: currentMessage }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const parts = buffer.split('\n\n')
      buffer = parts.pop()

      for (const part of parts) {
        if (!part.startsWith('data: ')) continue

        const data = part.replace('data: ', '').trim()

        if (data === '[DONE]') continue

        const text = JSON.parse(data)

        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: updated[updated.length - 1].text + text,
          }
          return updated
        })
      }
    }
  } catch (error) {
    setMessages((prev) => {
      const updated = [...prev]
      updated[updated.length - 1] = {
        role: 'ai',
        text: '❌ Failed to connect to AI server.',
      }
      return updated
    })
  } finally {
    setLoading(false)
  }
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const clearChat = () => {
    const cleared = [
      {
        role: 'ai',
        text: '👋 Chat cleared. Ask me something new!',
      },
    ]

    setMessages(cleared)
    localStorage.setItem('chat-history', JSON.stringify(cleared))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">🤖 Gemini AI Chatbot</h1>

        <button
          onClick={clearChat}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 transition"
        >
          Clear Chat
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap shadow ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.1s]" />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}

          {/* Auto-scroll target */}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-slate-800 p-4">
        <div className="mx-auto max-w-3xl flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App