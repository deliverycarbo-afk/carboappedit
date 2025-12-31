import React, { useState } from 'react';
import { MessageCircle, X, Send, Paperclip } from 'lucide-react';
import { Button, Avatar } from './UIComponents';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Suporte Carbo', role: 'SUPPORT', text: 'Olá! Como posso ajudar hoje?', timestamp: '10:00', isMe: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      sender: 'Você',
      role: 'CLIENT', // Defaulting to CLIENT role for the global widget
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isMe: true
    }]);
    setInputValue('');
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-carbo-primary hover:bg-carbo-primaryHover text-white rounded-full shadow-float flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] bg-white rounded-2xl shadow-float border border-gray-100 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl flex items-center gap-3">
             <div className="relative">
                <Avatar fallback="SC" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
             </div>
             <div>
               <h4 className="font-bold text-gray-900 text-sm">Chat Global</h4>
               <p className="text-xs text-green-600 font-bold">Online agora</p>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider my-4">Hoje</div>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.isMe 
                    ? 'bg-carbo-primary text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white rounded-b-2xl">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"><Paperclip size={18}/></button>
            <input 
              className="flex-1 bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-carbo-primary/20 outline-none"
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-2 bg-carbo-primary text-white rounded-full hover:bg-carbo-primaryHover shadow-md"><Send size={16}/></button>
          </div>
        </div>
      )}
    </>
  );
};