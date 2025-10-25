# 🧠 Learn WebSocket

A simple project to learn how **WebSockets** work — using a Node.js server and a web client that can send and receive real-time messages.

This repository demonstrates:
- Basic WebSocket server setup with the [`ws`](https://www.npmjs.com/package/ws) library  
- Client connections from a web frontend  
- Broadcasting messages to all connected clients  
- Understanding how WebSocket connections open, message, and close events work

---

## 📁 Project Structure

learn-web-socket/
├── server/ # Node.js WebSocket server
│ ├── src/
│ │ └── app.ts # Main WebSocket server logic
│ └── .env # Environment variables (port, etc.)
│
└── web/ # Web client (React/Next.js)
├── src/
│ └── app.tsx # Frontend WebSocket connection logic
└── .env.local # WebSocket URL

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/beyondsundae/learn-web-socket.git
cd learn-web-socket
