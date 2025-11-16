import { useState } from "react";

interface Message {
  type: "bot" | "user";
  text: string;
}

export default function ChatDock() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "Hi! I'm your club assistant. Ask me about projects, events, or type 'help' for options." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const lowerInput = input.toLowerCase().trim();
    let botResponse = "";

    if (lowerInput === "help" || lowerInput === "?") {
      botResponse = "I can help you with:\n• 'projects' - View club projects\n• 'events' - Upcoming events\n• 'members' - Member info\n• 'resources' - Club resources";
    } else if (lowerInput.includes("project")) {
      botResponse = "📋 Active Projects:\n• Portfolio Website\n• SDSU Hackathon 2024\n• Campus Events App\n• Member Directory";
    } else if (lowerInput.includes("event")) {
      botResponse = "📅 Upcoming Events:\n• General Meeting - Nov 20\n• Workshop: React Basics - Nov 25\n• Holiday Social - Dec 10";
    } else if (lowerInput.includes("member")) {
      botResponse = "👥 We have 45 active members! Type 'roster' to see the full list.";
    } else if (lowerInput.includes("resource")) {
      botResponse = "📚 Resources:\n• Club GitHub: github.com/ourclub\n• Discord Server\n• Google Drive\n• Meeting Notes";
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      botResponse = "Hello! How can I help you today?";
    } else {
      botResponse = `You said: "${input}"\n\nTry asking about projects, events, members, or resources. Type 'help' for more options.`;
    }

    setTimeout(() => {
      const botMessage: Message = { type: "bot", text: botResponse };
      setMessages(prev => [...prev, botMessage]);
    }, 300);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      width: open ? '350px' : '50px',
      background: '#ffffff',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width 0.3s ease'
    }}>
      <div style={{
        height: '56px',
        background: '#111827',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #374151',
        flexShrink: 0
      }}>
        {open && <strong>Assistant</strong>}
        <button 
          onClick={() => setOpen(v => !v)} 
          aria-label="Toggle chat"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {open ? "→" : "←"}
        </button>
      </div>

      {open && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.type === 'bot' ? 'flex-start' : 'flex-end'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  wordWrap: 'break-word',
                  background: msg.type === 'bot' ? '#f3f4f6' : '#111827',
                  color: msg.type === 'bot' ? '#111827' : '#ffffff',
                  borderBottomLeftRadius: msg.type === 'bot' ? '4px' : '12px',
                  borderBottomRightRadius: msg.type === 'user' ? '4px' : '12px'
                }}>
                  {msg.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            padding: '12px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            background: '#ffffff',
            flexShrink: 0
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              style={{
                padding: '8px 16px',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}