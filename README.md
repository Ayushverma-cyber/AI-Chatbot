# 🤖 AI Chatbot using Gemini API

[![Vercel](https://img.shields.io/badge/Live-Vercel-black?logo=vercel)](https://weather-app-weld-sigma-tfi7txf25k.vercel.app/)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite)

A modern **AI-powered chatbot** built with **React**, **Tailwind CSS**, **Node.js**, and **Express.js**. The application provides a ChatGPT-style conversational interface where users can send messages and receive AI-generated responses using **Google Gemini 3.6 Flash**.

---

## 🌐 Live Demo

* **Frontend:** https://ai-chatbot-ten-kappa-89.vercel.app
* **Backend:** https://ai-chatbot-12bc.onrender.com

---

## ✨ Features

* ChatGPT-style interface
* Real-time AI responses
* Streaming AI responses (ChatGPT-style typing)
* User and AI message bubbles
* Typing indicator animation
* Auto-scrolling chat
* Persistent chat history using localStorage
* Clear chat button
* Responsive design
* Backend API integration
* Error handling and graceful fallback support
* Prompt-engineered educational responses

---

## 🛠️ Tech Stack

### Frontend

* React + Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### AI

* Google Gemini API (**Gemini 3.6 Flash**)

---

## 📁 Project Structure

```text
AI-Chatbot/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ayushverma-cyber/AI-Chatbot.git
cd AI-Chatbot
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 3. Backend setup

Open a new terminal:

```bash
cd backend
npm install
node server.js
```

Backend runs on: **http://localhost:5000**

---

## 🔑 Environment Variables

Create a file named **`backend/.env`** and add:

```env
GEMINI_API_KEY=your_api_key
PORT=5000
```

---

## ⚙️ How It Works

1. User enters a message in the React frontend.
2. The frontend sends the message to the Express backend (`/chat`).
3. The backend calls the **Gemini 3.6 Flash API**.
4. The AI response is returned to the frontend and displayed in the chat interface.

---

## 📚 Key Learnings

* React state management with hooks
* API integration using `fetch`
* Express REST API development
* Environment variable management
* Google Gemini API integration
* Responsive UI design with Tailwind CSS
* Error handling and graceful fallback implementation
* Full-stack deployment workflow

---

## 🚀 Deployment

This project is deployed using:

* **Frontend:** Vercel
* **Backend:** Render

---

## 🔮 Future Improvements

* Conversation history storage
* Markdown rendering
* Streaming responses
* Voice input support
* Dark / light theme toggle
* Authentication system
* Save chats to a database
* Export chats as PDF

---

## 👨‍💻 Author

**Ayush Verma**

* GitHub: https://github.com/Ayushverma-cyber
* LinkedIn: https://www.linkedin.com/in/ayush-verma-596159383/

---

## 📄 License

This project is intended for **educational and portfolio purposes**.
