import React from 'react';
import { MessageSquare } from 'lucide-react';
import { marked } from 'marked';

export default function AiChat({ chatMessages, chatInput, setChatInput, chatLoading, onSend }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSend();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[450px] sm:h-[500px]">
      <div>
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" /> Health Q&amp;A Assistant
        </h3>
        <div className="space-y-3 mt-3 max-h-[310px] sm:max-h-[350px] overflow-y-auto pr-1 text-xs">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[88%] sm:max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-slate-100 text-slate-800 mr-auto'
              }`}
            >
              {msg.role === 'user' ? (
                msg.text
              ) : (
                <div 
                  className="markdown-content space-y-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.text || '') }} 
                />
              )}
            </div>
          ))}
          {chatLoading && (
            <div className="text-slate-400 text-[11px] italic">Vitalist is thinking...</div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-200">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={onSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
