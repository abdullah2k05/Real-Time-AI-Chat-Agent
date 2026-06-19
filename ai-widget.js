const STORAGE_KEY = "ai_widget_chat";

(function () {
  // Inject Font
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Inject CSS
  const style = document.createElement("style");
  style.innerHTML = `
    #ai-widget-wrapper {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
    }

    #ai-chat-box {
      width: 360px;
      height: 520px;
      max-height: calc(100vh - 100px);
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: bottom right;
      border: 1px solid rgba(0,0,0,0.06);
    }
    
    #ai-chat-box.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    #ai-chat-header {
      background: linear-gradient(135deg, #111111 0%, #2a2a2a 100%);
      color: white;
      padding: 18px 20px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      z-index: 2;
    }
    
    #ai-chat-header .dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.25);
    }

    #ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #fdfdfd;
      scroll-behavior: smooth;
    }

    #ai-messages::-webkit-scrollbar {
      width: 6px;
    }
    #ai-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #ai-messages::-webkit-scrollbar-thumb {
      background: #dfdfdf;
      border-radius: 10px;
    }

    .ai-msg-bubble {
      max-width: 85%;
      padding: 12px 16px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      animation: ai-slide-in 0.25s ease-out forwards;
    }

    .ai-msg-user {
      background: #111111;
      color: white;
      border-radius: 18px 18px 4px 18px;
      align-self: flex-end;
    }

    .ai-msg-bot {
      background: #ffffff;
      color: #111111;
      border-radius: 18px 18px 18px 4px;
      align-self: flex-start;
      border: 1px solid #eaeaea;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }

    @keyframes ai-slide-in {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    #ai-input-area {
      padding: 14px 16px;
      background: #ffffff;
      border-top: 1px solid #eaeaea;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 2;
    }

    #ai-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      background: #f4f4f5;
      padding: 12px 18px;
      border-radius: 24px;
      transition: background 0.2s, box-shadow 0.2s;
    }
    
    #ai-input:focus {
      background: #ffffff;
      box-shadow: 0 0 0 2px #111111;
    }

    #ai-send-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #111111;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
      outline: none;
      flex-shrink: 0;
    }
    #ai-send-btn:hover {
      background: #2a2a2a;
      transform: scale(1.05);
    }
    #ai-send-btn:active {
      transform: scale(0.95);
    }
    #ai-send-btn svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      margin-left: 2px;
      margin-top: 1px;
    }

    #ai-toggle-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #111111 0%, #2a2a2a 100%);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
      outline: none;
    }
    #ai-toggle-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
    }
    #ai-toggle-btn:active {
      transform: scale(0.95);
    }
    #ai-toggle-btn svg {
      width: 28px;
      height: 28px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    #ai-toggle-btn .chat-icon {
      position: absolute;
    }
    #ai-toggle-btn.open .chat-icon {
      transform: rotate(90deg) scale(0);
      opacity: 0;
    }
    #ai-toggle-btn .close-icon {
      position: absolute;
      transform: rotate(-90deg) scale(0);
      opacity: 0;
    }
    #ai-toggle-btn.open .close-icon {
      transform: rotate(0) scale(1);
      opacity: 1;
    }
    
    .ai-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 6px 4px;
    }
    .ai-typing-dot {
      width: 6px;
      height: 6px;
      background: #a1a1aa;
      border-radius: 50%;
      animation: ai-typing 1.4s infinite ease-in-out both;
    }
    .ai-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .ai-typing-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes ai-typing {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Create UI Structure
  const wrapper = document.createElement("div");
  wrapper.id = "ai-widget-wrapper";

  const chatBox = document.createElement("div");
  chatBox.id = "ai-chat-box";
  chatBox.innerHTML = `
    <div id="ai-chat-header">
      <div class="dot"></div>
      AI Assistant
    </div>
    <div id="ai-messages"></div>
    <div id="ai-input-area">
      <input type="text" id="ai-input" placeholder="Ask AI anything..." autocomplete="off" />
      <button id="ai-send-btn">
        <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  `;

  const toggleBtn = document.createElement("button");
  toggleBtn.id = "ai-toggle-btn";
  toggleBtn.innerHTML = `
    <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  `;

  wrapper.appendChild(chatBox);
  wrapper.appendChild(toggleBtn);
  document.body.appendChild(wrapper);

  // Logic
  const input = chatBox.querySelector("#ai-input");
  const messagesContainer = chatBox.querySelector("#ai-messages");
  const sendBtn = chatBox.querySelector("#ai-send-btn");
  let isOpen = false;

  toggleBtn.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatBox.classList.add("open");
      toggleBtn.classList.add("open");
      input.focus();
    } else {
      chatBox.classList.remove("open");
      toggleBtn.classList.remove("open");
    }
  };

  // LOAD CHAT AND SAVE IT FOR 5 MINS In THE WIDGET
  function loadChat(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const data = JSON.parse(saved);

    if(Date.now() - data.time > 5 * 60 * 1000){
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return data.messages;
  }

  function formatText(text) {
    if (!text) return "";
    // Escape HTML first to prevent XSS
    let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Parse basic Markdown
    return escaped
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold (**text**)
      .replace(/\*(.*?)\*/g, "<em>$1</em>")             // Italic (*text*)
      .replace(/\n/g, "<br>");                          // New lines to HTML line breaks
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "ai-msg-bubble " + (type === "user" ? "ai-msg-user" : "ai-msg-bot");
    
    // Instead of innerText, use innerHTML with our safe formatter
    div.innerHTML = formatText(text);
    
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div;
  }
  
  function showTypingIndicator() {
    const div = document.createElement("div");
    div.className = "ai-msg-bubble ai-msg-bot";
    div.id = "ai-typing";
    div.innerHTML = '<div class="ai-typing-indicator"><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div></div>';
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function hideTypingIndicator() {
    const typing = messagesContainer.querySelector("#ai-typing");
    if (typing) typing.remove();
  }

  // Auth / Network Logic
  let authToken = "";
  async function initializeSession() {
      try {
          const res = await fetch("http://localhost:8000/api/auth/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userID: "guest-" + Math.random().toString(36).substring(7) })
          });
          const data = await res.json();
          if(data.token){
            authToken = data.token;
          }
      } catch (e) {
          console.error("AI Widget Auth Error:", e);
      }
  }
  initializeSession();

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";
    
    showTypingIndicator();

    try {
        const res = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
          },
          body: JSON.stringify({ message }),
        });

        const data = await res.json();
        hideTypingIndicator();
        
        if (data.error) {
          addMessage("Something went wrong: " + data.error, "bot");
          return;
        }
        addMessage(data.response, "bot");
    } catch (e) {
        hideTypingIndicator();
        addMessage("Connection error. Is the server running?", "bot");
        console.error(e);
    }
  }

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
  
  sendBtn.addEventListener("click", sendMessage);
  
  // Initial Greeting
  setTimeout(() => {
     addMessage("Hi! How can I help you today?", "bot");
  }, 1000);

})();