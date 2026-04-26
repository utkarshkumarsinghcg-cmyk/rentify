import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { 
  MessageSquare, 
  Send, 
  X, 
  Paperclip, 
  Smile,
  ShieldCheck
} from 'lucide-react';
import chatService from '../../services/chatService';

const SupportChat = ({ initialMessages, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialMessages) {
      setChatHistory(
        initialMessages.map(m => ({
          id: m._id || Date.now() + Math.random(),
          sender: m.sender?._id === userId ? 'user' : 'admin',
          text: m.text,
          time: new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      );
    }
  }, [initialMessages, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const newMessageText = message;
    setMessage('');
    setIsSending(true);

    const tempId = Date.now();
    setChatHistory(prev => [
      ...prev,
      {
        id: tempId,
        sender: 'user',
        text: newMessageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      // Simulate typing indicator from admin
      setIsTyping(true);
      
      await chatService.sendMessage('admin', newMessageText);
      setIsSending(false);
      
      // Simulate admin response if backend isn't truly real-time for demo
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
      setChatHistory(prev => prev.filter(m => m.id !== tempId)); // remove message on fail
      setMessage(newMessageText); // restore text
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const unreadCount = isOpen ? 0 : 1; // Fake unread count for UI demo if closed

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end group">
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            Chat with Support
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 z-50 ${
            isOpen ? 'bg-slate-800 text-white rotate-90 scale-90' : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white hover:shadow-indigo-500/30 hover:-translate-y-1'
          }`}
        >
          <div className={`absolute inset-0 rounded-full border-2 border-indigo-400 opacity-0 ${!isOpen ? 'animate-ping opacity-50' : ''}`}></div>
          {isOpen ? <X size={24} className="-rotate-90" /> : <MessageSquare size={24} />}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-slate-200/60 dark:border-slate-800 animate-in slide-in-from-bottom-8 duration-300 z-50 origin-bottom-right"
        >
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 flex items-center gap-3 relative z-10 shadow-sm">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 flex items-center justify-center">
                <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">Admin Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">We typically reply within a few minutes</p>
            </div>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth">
            {chatHistory.length > 0 ? (
              chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 text-[13.5px] shadow-sm relative group ${
                    msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-[20px] rounded-tr-[4px]' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-[20px] rounded-tl-[4px]'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1.5 font-medium ${msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-base">Hi there!</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[200px]">How can we help you today? Send us a message.</p>
              </div>
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3.5 rounded-[20px] rounded-tl-[4px] shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form 
              onSubmit={handleSendMessage} 
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
            >
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <Smile size={18} />
              </button>
              
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-900 dark:text-white px-1 placeholder-slate-400"
              />
              
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hidden sm:block">
                <Paperclip size={18} />
              </button>
              
              <button 
                type="submit" 
                disabled={!message.trim() || isSending}
                className={`p-2 rounded-full flex items-center justify-center transition-all ${
                  message.trim() && !isSending
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-105 active:scale-95' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={16} className={message.trim() && !isSending ? 'ml-0.5' : ''} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChat;
