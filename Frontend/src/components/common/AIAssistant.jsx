import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Bot, Minimize2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import chatService from '../../services/chatService';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSupportMode, setIsSupportMode] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Rentify AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  const userRole = localStorage.getItem('rentify_user_role') || user?.role?.toLowerCase() || 'guest';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Poll for Admin replies
  useEffect(() => {
    if (!isSupportMode || !isOpen) return;

    const pollInterval = setInterval(async () => {
      try {
        const adminId = "66291a82e9d2f3a8b0e8c0d1"; // Placeholder
        const conversation = await chatService.getConversation(adminId);
        
        // Find messages sent by admin that are not in our state
        const newMessages = conversation.filter(msg => 
          msg.sender !== user?.id && 
          !messages.some(m => m.content === msg.text && m.role === 'assistant')
        );

        if (newMessages.length > 0) {
          setMessages(prev => [
            ...prev, 
            ...newMessages.map(m => ({ role: 'assistant', content: m.text }))
          ]);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [isSupportMode, isOpen, messages, user]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // If in support mode, send to Admin
    if (isSupportMode) {
      try {
        // In a real app, you'd fetch the Admin's ID. 
        // For this demo, we'll use a placeholder or the first admin found.
        await chatService.sendMessage("66291a82e9d2f3a8b0e8c0d1", userMessage); // Placeholder Admin ID
        setIsTyping(false);
        return; 
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      let response = '';
      const q = userMessage.toLowerCase();

      if (q.includes('support') || q.includes('human') || q.includes('manager') || q.includes('admin')) {
        response = "I'm connecting you to a live Support Manager. You can now chat directly with our team!";
        setIsSupportMode(true);
      } else if (userRole === 'admin') {
        if (q.includes('security') || q.includes('alert')) response = '🔒 Today there are 24 security alerts. The most critical is a brute-force attempt from IP 192.168.1.1 which has been auto-flagged and blocked.';
        else if (q.includes('revenue') || q.includes('trend')) response = '📈 Revenue is trending up +18.1% this month. Q3 forecast predicts a 14% increase in user onboarding.';
        else if (q.includes('user') || q.includes('tenant')) response = '👤 There are 1,248 active users across all roles. 3 new registrations are pending review.';
        else response = '🧠 As System Admin, I can fetch analytics, audit logs, or manage system configuration. What do you need?';
      } else if (userRole === 'renter' || userRole === 'tenant') {
        if (q.includes('payment') || q.includes('due') || q.includes('rent')) response = '💳 Your next rent payment of $2,450 is due in 5 days. Use the Quick Pay button on your dashboard for instant payment.';
        else if (q.includes('maintenance') || q.includes('fix') || q.includes('repair')) response = '🔧 To submit a maintenance request, go to your dashboard and click the "+" button. Provide a photo and description for faster resolution.';
        else if (q.includes('lease') || q.includes('renew')) response = '📄 Your lease expires in 45 days. Click "Renew Now" on your dashboard to start the digital renewal process.';
        else response = '🏠 I can help with rent payments, lease renewals, or maintenance requests. What do you need?';
      } else if (userRole === 'owner') {
        if (q.includes('occupancy') || q.includes('vacant')) response = '🏢 Your portfolio occupancy is at 97.2%. There are 4 vacant units across your properties.';
        else if (q.includes('income') || q.includes('revenue')) response = '💰 Your gross income this month is $48,250 across 14 active properties — up 12.5% vs last month.';
        else if (q.includes('maintenance')) response = '🔧 You have 12 pending maintenance requests. 2 are high-priority. View them under "My Portfolio".';
        else response = '📊 I can generate portfolio reports, check occupancy, or review maintenance statuses. How can I assist?';
      } else if (userRole === 'service') {
        if (q.includes('job') || q.includes('request')) response = '📋 You have 8 pending job requests. 2 are urgent. Check your dashboard for estimated earnings.';
        else if (q.includes('earn') || q.includes('pay') || q.includes('income')) response = '💵 Your total earnings this week are $1,840. Your highest-paying job is the HVAC installation at Skyline Lofts.';
        else response = '🔨 I can help you manage job requests, track earnings, or update your availability. What do you need?';
      } else {
        response = "I'm the Rentify AI. Please log in to get personalized assistance regarding your properties or leases.";
      }

      setIsTyping(false);

      let currentText = '';
      let i = 0;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const typeInterval = setInterval(() => {
        if (i < response.length) {
          currentText += response.charAt(i);
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'assistant', content: currentText };
            return newMessages;
          });
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 15);

    }, 900);
  };

  const unreadCount = 1; // Mock

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 premium-gradient text-white rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-40 group"
          title="Ask AI"
        >
          <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] h-[520px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 flex flex-col z-40 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Header */}
          <div className="p-4 premium-gradient flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight">Rentify AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold opacity-80">Online · Powered by Claude</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <Minimize2 size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`max-w-[82%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'premium-gradient text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                }`}>
                  {m.content || (m.role === 'assistant' && <span className="opacity-50 italic text-xs">Thinking…</span>)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-3">
              {['Payment due?', 'Maintenance status', 'Lease info'].map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                  className="text-xs font-bold text-primary bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 text-sm py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2.5 premium-gradient text-white rounded-xl disabled:opacity-40 hover:opacity-90 transition-all shadow-md shadow-blue-500/20 shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
