
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { Send, User, Sparkles as AiIcon } from 'lucide-react'; // Renamed Sparkles to AiIcon to avoid conflict

const ChatScreen: React.FC = () => {
  const { 
    userProfile, 
    aiChat, 
    initializeAiChat, 
    sendAiChatMessage, 
    aiChatMessages, 
    isLoadingAi,
    setAiChatMessages // Added to potentially clear chat or load history
  } = useAppContext();
  
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aiChat) {
      initializeAiChat();
    }
  }, [aiChat, initializeAiChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const messageToSend = userInput;
    setUserInput('');
    await sendAiChatMessage(messageToSend);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px] animate-fadeIn">
      <h2 className="text-3xl font-estedad gold-text mb-6 pb-2 border-b-2 border-purple-500">
        چت با دستیار هوش مصنوعی
      </h2>
      <Card className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-800 bg-opacity-40 rounded-t-lg custom-scrollbar">
          {aiChatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  {msg.role === 'model' && <AiIcon size={16} className="mr-2 text-yellow-400" />}
                  <span className="font-semibold text-sm">
                    {msg.role === 'user' ? userProfile.name : 'دستیار ۳×۵'}
                  </span>
                  {msg.role === 'user' && <User size={16} className="ml-2 text-gray-300" />}
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoadingAi && aiChatMessages[aiChatMessages.length -1]?.role === 'user' && ( // Show loading only if last message was user
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow bg-gray-700 text-gray-200 rounded-bl-none">
                <div className="flex items-center">
                  <AiIcon size={16} className="mr-2 text-yellow-400" />
                  <span className="font-semibold text-sm">دستیار ۳×۵</span>
                </div>
                <LoadingSpinner size="sm" text="در حال نوشتن..." />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
              disabled={isLoadingAi || !aiChat}
            />
            <Button type="submit" variant="primary" glowEffect disabled={isLoadingAi || !userInput.trim() || !aiChat} className="px-5">
              <Send size={20} />
            </Button>
          </div>
          {!aiChat && API_KEY && <p className="text-xs text-yellow-500 mt-2 text-center">درحال اتصال به دستیار هوش مصنوعی...</p>}
          {!API_KEY && <p className="text-xs text-red-500 mt-2 text-center">کلید API تنظیم نشده. چت غیرفعال است.</p>}
        </form>
      </Card>
    </div>
  );
};

// Add process.env.API_KEY to global scope for this file if not already globally available in your setup.
// This is usually handled by build tools. For a simple setup, you might need to declare it.
declare global {
  interface Window { // For client-side access, if needed, though API key should remain server-side or build-time injected.
    // process?: { env: { [key: string]: string | undefined } };
  }
}
const API_KEY = process.env.API_KEY; // Ensure this is accessible.

export default ChatScreen;
