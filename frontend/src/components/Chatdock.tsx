import { useState, useMemo } from "react";
import { Send, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'; // Using lucide-react for modern icons

interface Message {
  type: "bot" | "user";
  text: string;
}

// Simple ID generator for demonstration purposes. In a real app, use useId() or crypto.randomUUID()
const generateSessionId = () => `chat-session-${Date.now()}`;

export default function ChatDock() {
  const [open, setOpen] = useState(true);
  const sessionId = useMemo(generateSessionId, []); // Ensures ID is only created once
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "Hi! I'm your club assistant. Ask me about finance policies, action items, or type 'help' for options." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // NEW STATE: Track if the input field is currently focused
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Helper function for sending messages to backend, now includes sessionId.
   */
  const sendToGemini = async (userText: string, currentSessionId: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- UPDATED PAYLOAD to include sessionId ---
        body: JSON.stringify({ 
          user_message: userText, 
          session_id: currentSessionId 
        }),
      });

      if (!response.ok) {
        let errorDetail = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch {
          // ignore parse errors
        }
        throw new Error(errorDetail);
      }

      const data = await response.json();
      if (!data.response) throw new Error("Empty response from Gemini");
      return data.response;

    } catch (error: any) {
      console.error("Error fetching chat response:", error);
      return `Error: ${error.message || "Could not connect to the server."}`;
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: Message = { type: "user", text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput(""); // Clear input immediately

    // Query Gemini backend with the unique session ID
    const botText = await sendToGemini(trimmedInput, sessionId);

    const botMessage: Message = { type: "bot", text: botText };
    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Tailwind classes translated to inline styles for single-file component adherence

  return (
    <div style={{
      width: open ? '350px' : '50px',
      background: '#ffffff',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      transition: 'width 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Header */}
      <div style={{
        height: '56px',
        background: '#111827', // Dark background
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #374151',
        flexShrink: 0
      }}>
        {open && <strong style={{fontSize: '16px', letterSpacing: '0.5px'}}>🤖 AI Assistant</strong>}
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
            borderRadius: '4px',
            transition: 'transform 0.2s'
          }}
        >
          {open ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Chat Body and Input */}
      {open && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Message List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            // Scroll to bottom effect
            scrollBehavior: 'smooth'
          }}
          ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.type === 'bot' ? 'flex-start' : 'flex-end',
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  wordWrap: 'break-word',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  background: msg.type === 'bot' ? '#eef2ff' : '#1e3a8a', // Light Blue/Dark Blue
                  color: msg.type === 'bot' ? '#111827' : '#ffffff',
                  borderBottomLeftRadius: msg.type === 'bot' ? '4px' : '12px',
                  borderBottomRightRadius: msg.type === 'user' ? '4px' : '12px'
                }}>
                  {msg.text.split('\n').map((line, i) => (
                    <div key={i}>{line || <br />}</div>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
                 <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        background: '#eef2ff',
                        color: '#111827',
                    }}>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                </div>
            )}
          </div>
          
          {/* Input Area */}
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
              // NEW: Event handlers to track focus
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a message..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                // Use state to apply conditional border color
                border: `1px solid ${isFocused ? '#1e3a8a' : '#d1d5db'}`, 
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                ...(loading ? { background: '#f9fafb', cursor: 'not-allowed' } : {}),
              }}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                background: (loading || !input.trim()) ? '#9ca3af' : '#1e3a8a', // Dark blue
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}