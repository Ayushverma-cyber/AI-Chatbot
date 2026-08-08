const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { GoogleGenAI } = require('@google/genai')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const prompt = `
You are a helpful educational AI assistant.
Answer clearly in simple English.
Keep responses concise unless the user asks for details.
Do not introduce yourself unless the user explicitly asks who you are.

User: ${message}
`

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    })

    res.json({ reply: result.text })
  } catch (error) {
    console.error('Gemini Error:', error)
    res.status(500).json({
      error: 'Failed to generate response',
    })
  }
})

// NEW STREAMING ENDPOINT
app.post('/chat-stream', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).end()
    }

    const prompt = `
You are a helpful educational AI assistant.
Answer clearly in simple English.
Keep responses concise unless the user asks for details.
Do not introduce yourself unless the user explicitly asks who you are.

User: ${message}
`

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
      contents: prompt,
    })

    for await (const chunk of stream) {
      const text = chunk.text || ''
      res.write(`data: ${JSON.stringify(text)}\n\n`)
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('Stream Error:', error)
    res.write(`data: ${JSON.stringify('⚠️ Streaming failed.')}\n\n`)
    res.end()
  }
})

app.get('/', (req, res) => {
  res.send('AI Chatbot backend is running 🚀')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})