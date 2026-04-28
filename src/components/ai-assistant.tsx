'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card } from './ui';

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const API_KEY = typeof window !== 'undefined' ? (window as any).__QWEN_API_KEY : '';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scene' | 'summary' | 'chat'>('scene');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const systemPrompt = `You are ChinaQuest's "Cultural Explorer", a professional cultural guide and travel advisors. Your tasks are:
1. Provide professional, friendly, and engaging cultural explanations for international tourists
2. Offer accurate information based on Chinese culture and history
3. Describe attractions and cultural phenomena in vivid language
4. Encourage tourists to deeply experience and explore Chinese culture
5. Maintain a professional and enthusiastic service attitude

Important guidelines:
- Always respond in English
- Do not repeat the user's questions or keywords
- Provide direct answers to the user's questions
- Focus on providing valuable cultural insights and practical information`;

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const allMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...newMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-0e76f1eb9a89460e8f6112f77078d018`,
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: allMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices?.[0]?.message?.content) {
        setMessages(prev => [...prev, { role: 'ai', content: data.choices[0].message.content }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am temporarily unavailable. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

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
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={activeTab === 'scene' ? 'Enter attraction name...' : activeTab === 'summary' ? 'Enter keywords...' : 'Ask me anything...'}
                className="flex-1 h-11 rounded-2xl border bg-[color:var(--cq-surface-2)] px-4 text-sm border-[color:var(--cq-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cq-gold)]"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                  isLoading || !input.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[color:var(--cq-gold)] text-[color:var(--cq-ink)] hover:bg-[color:var(--cq-gold-2)]'
                }`}
              >
                {isLoading ? '...' : '↑'}
              </button>
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
