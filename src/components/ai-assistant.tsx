'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Card } from './ui';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scene' | 'summary' | 'chat'>('scene');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 调用实际的API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          type: activeTab,
          prompt: input
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.message || '抱歉，暂时无法处理您的请求，请稍后再试。' }]);
      }
    } catch (error) {
      console.error('API error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: '抱歉，暂时无法处理您的请求，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 max-h-[500px] flex flex-col border-[color:var(--cq-border)] shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[color:var(--cq-border)]">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[color:var(--cq-gold)] flex items-center justify-center text-[color:var(--cq-ink)] font-semibold">
                AI
              </div>
              <div>
                <div className="text-sm font-semibold">Cultural Explorer</div>
                <div className="text-xs text-[color:var(--cq-muted)]">AI Assistant</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-black/5 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[color:var(--cq-border)]">
            <button
              onClick={() => setActiveTab('scene')}
              className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'scene' ? 'text-[color:var(--cq-gold)] border-b-2 border-[color:var(--cq-gold)]' : 'text-[color:var(--cq-muted)] hover:text-[color:var(--cq-text)]'}`}
            >
              Scene Intro
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'summary' ? 'text-[color:var(--cq-gold)] border-b-2 border-[color:var(--cq-gold)]' : 'text-[color:var(--cq-muted)] hover:text-[color:var(--cq-text)]'}`}
            >
              Trip Summary
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'chat' ? 'text-[color:var(--cq-gold)] border-b-2 border-[color:var(--cq-gold)]' : 'text-[color:var(--cq-muted)] hover:text-[color:var(--cq-text)]'}`}
            >
              Chat
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[color:var(--cq-ink)] text-white' : 'bg-[color:var(--cq-surface-2)]'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-center my-2">
                <div className="h-4 w-4 rounded-full border-2 border-[color:var(--cq-gold)] border-t-transparent animate-spin"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[color:var(--cq-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={activeTab === 'scene' ? 'Enter attraction name for introduction...' : activeTab === 'summary' ? 'Enter experience keywords for summary...' : 'Enter your question...'}
                className="flex-1 h-11 rounded-2xl border bg-[color:var(--cq-surface-2)] px-4 text-sm border-[color:var(--cq-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cq-gold)]"
              />
              <Button
                onClick={handleSend}
                size="sm"
                className={isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isLoading ? 'Sending...' : '↑'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] shadow-lg flex items-center justify-center hover:bg-[color:var(--cq-gold-2)] transition"
        >
          <div className="text-2xl font-bold">AI</div>
        </button>
      )}
    </div>
  );
}
