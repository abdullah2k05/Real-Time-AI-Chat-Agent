# Real-Time AI Chat Agent 🤖💬

A beautiful, fully-functional, real-time AI customer support widget designed to be embedded into any website. Built with Node.js, Express, Redis, and Groq's high-speed LLMs.

## 🌟 Features

- **Beautiful Floating Widget UI:** A modern, glassy, animated widget ready to embed.
- **Markdown Support:** Renders bold, italics, and proper text formatting seamlessly.
- **Typing Indicators:** Real-time animated `...` dots while waiting for the AI response.
- **Session Memory:** Uses Redis to preserve chat history by user session so the AI remembers context.
- **Secure Authentication:** Generates JWT tokens upon initialization to prevent unauthorized API requests.
- **Plug-and-Play:** Zero-dependency vanilla JavaScript widget file—just drop it into your HTML!

## ⚙️ Tech Stack

- **Backend:** Node.js, Express, JWT, `@redis/client`
- **Frontend:** Vanilla JavaScript, CSS (Injected dynamically)
- **AI Engine:** Groq SDK (High-speed Llama / Mixtral inference)

## 🚀 Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- [Redis](https://redis.io/download) server installed and running locally on port `6379`.

### 2. Clone and Install
```bash
git clone https://github.com/abdullah2k05/Real-Time-AI-Chat-Agent.git
cd Real-Time-AI-Chat-Agent
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of your project with the following variables:
```env
PORT=8000
GROQ_API_KEY=your_groq_api_key_here
SESSION=your_random_session_secret
JWT_SECRET=your_random_jwt_secret
SHOP_NAME="My Awesome Store"
```

### 4. Run the Server
Start the backend server.
```bash
npm start
```
*Note: Make sure your Redis server is running in the background before starting the app!*

---

## 🌐 How to Embed in Your Website

Integrating this AI Agent into your existing static site, React app, WordPress blog, or any other website is incredibly simple!

### Step 1: Host the Backend
Deploy your backend code (Node.js + Redis) to a server or cloud host (e.g. Render, Railway, AWS, DigitalOcean). 

### Step 2: Update the Widget API URLs
Inside the `ai-widget.js` file, locate the `fetch` commands. Change `http://localhost:8000` to the actual live URL of your deployed backend.

```javascript
// Inside initializeSession():
const res = await fetch("https://your-backend-url.com/api/auth/start", { ... });

// Inside sendMessage():
const res = await fetch("https://your-backend-url.com/chat", { ... });
```

### Step 3: Add the Script to Your Website
Host the `ai-widget.js` file somewhere accessible (or drop it directly into your project's assets folder). Include it just before the closing `</body>` tag on any HTML page you want the widget to appear on.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Cool Website</title>
</head>
<body>
    
    <!-- Your website content goes here -->
    <h1>Welcome to my website!</h1>

    <!-- 🤖 Add the AI Widget Script right before the closing body tag -->
    <script src="/path/to/your/ai-widget.js"></script>
    
</body>
</html>
```

That's it! When the page loads, the widget will instantly authenticate with the backend, fetch a session token, and cleanly render the chat button in the bottom right corner.

## 🛠 Customizing the UI
The entire UI styling is contained within a template literal `<style>` block at the very top of `ai-widget.js`. You can easily adjust colors, fonts, margins, sizes, and animations by modifying that CSS block without needing to add extra CSS logic to your host websites.
