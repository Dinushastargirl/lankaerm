import React, { useState } from 'react';
import { Sparkles, Send, Brain, Bot } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome. I am your EMR Clinical Co-Pilot. I can help synthesize patient records, suggest diagnostic possibilities based on documented symptoms, and draft clinical notes. How can I assist you today?' }
  ]);
  const [query, setQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');

    // Simulate clinical response
    setTimeout(() => {
      let botResponse = 'Analyzing EMR telemetry logs... ';
      if (query.toLowerCase().includes('dengue')) {
        botResponse += 'Based on clinical guidelines for Dengue Fever in Sri Lanka: Instruct strict fluid intake logs. Monitor platelets count daily. Do not administer NSAIDs (like Ibuprofen) due to bleeding risks. Recommend Paracetamol 500mg Q6H PO.';
      } else if (query.toLowerCase().includes('hypertension')) {
        botResponse += 'For hypertension management: Ensure patient has salt intake restricted below 2g/day. First-line therapy for non-diabetic South Asian patient cohorts includes Losartan or Amlodipine. Check serum creatinine levels periodically.';
      } else {
        botResponse += 'I have cataloged your instruction. To search clinical guidelines, please ask about specific diagnoses like "Dengue Fever guidelines" or "Hypertension therapy".';
      }

      setMessages(prev => [...prev, { role: 'assistant', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col justify-between">
      
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-clinical-400">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-2xl font-bold text-white">AI EMR Co-Pilot</h2>
          </div>
          <p className="text-sm text-slate-400">Secure, HIPAA-compliant clinical reasoning engine powered by medical LLMs.</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-clinical-500/10 px-3 py-1.5 rounded-xl border border-clinical-500/20 text-xs font-semibold text-clinical-400">
          <Brain className="h-4 w-4" />
          <span>LankaMed-LLM Online</span>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 my-4 overflow-y-auto space-y-4 pr-1 bg-slate-900/30 rounded-2xl border border-slate-850 p-6 flex flex-col justify-end">
        <div className="space-y-4 max-h-full overflow-y-auto flex flex-col">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex items-start space-x-3.5 max-w-[80%] ${
                m.role === 'user' ? 'self-end flex-row-reverse space-x-reverse' : 'self-start'
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
                m.role === 'user' ? 'bg-clinical-600 text-white' : 'bg-slate-800 text-clinical-400 border border-slate-750'
              }`}>
                {m.role === 'user' ? 'MD' : <Bot className="h-4.5 w-4.5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-clinical-500/10 text-slate-200 border border-clinical-500/20 rounded-tr-none' 
                  : 'bg-slate-900 text-slate-300 border border-slate-850 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSend} className="relative mt-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a clinical question (e.g. 'Show Sri Lankan guidelines for Dengue Fever management')..."
          className="w-full bg-slate-900 border border-slate-850 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-clinical-500 transition-all border-slate-800"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-clinical-600 hover:bg-clinical-500 rounded-lg flex items-center justify-center text-white active:scale-95 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
