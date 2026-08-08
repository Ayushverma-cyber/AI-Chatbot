import { useEffect, useRef, useState } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef(null)

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        text: '👋 Hi! I am your Gemini AI assistant. Ask me anything.',
      },
    ])
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      role: 'user',
      text: message,
    }

    setMessages((prev) => [...prev, userMessage])

    const currentMessage = message
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      const data = await response.json()

      const aiMessage = {
        role: 'ai',
        text: data.reply,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: '❌ Failed to connect to AI server.',
        },
      ])
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
    setMessages([
      {
        role: 'ai',
        text: '👋 Chat cleared. Ask me something new!',
      },
    ])
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