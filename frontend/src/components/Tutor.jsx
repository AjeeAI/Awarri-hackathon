import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Send, 
  Volume2, 
} from 'lucide-react';

const AITutor = () => {
  const [inputText, setInputText] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 1. Ref to hold the Speech Recognition instance
  const recognitionRef = useRef(null);

  // 2. Initialize Speech Logic on Mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      
      // 1. KEY CHANGE: Keep listening even after pauses
      recognitionRef.current.continuous = true; 
      
      // 2. Keep interim results true so you see words as you speak
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        // When 'continuous' is true, event.results contains ALL snippets since starting
        // We want to join them all together
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setInputText(transcript);
      };

      // 3. Handling the "End" event intelligently
      recognitionRef.current.onend = () => {
        // If the user clicked "Stop", isTalking will be false (handled in handleTalk)
        // But if the browser stopped it unexpectedly (network glitch), we might want to restart it.
        
        // For now, we'll trust the state. If React thinks we should be talking, 
        // but the browser stopped, we can try to restart (Auto-restart logic).
        // However, a simpler approach is to just respect the stop:
        setIsTalking(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        // Ignore "no-speech" errors as they just mean the user was quiet
        if (event.error !== 'no-speech') {
            setIsTalking(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);
  // 3. Updated Handle Talk to trigger the engine
  const handleTalk = () => {
    if (!recognitionRef.current) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    if (!isTalking) {
      try {
        recognitionRef.current.start();
        setIsTalking(true);
      } catch (err) {
        console.error("Mic already active");
      }
    } else {
      recognitionRef.current.stop();
      setIsTalking(false);
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Good morning. I have very beautiful lace. What do you want to buy?",
      language: "Yoruba",
      translation: 'E kaaro o! Mo ni lace to rewa gan. Ki le fe ra?',
      audioPlayed: false
    }
  ]);

  const [translation, setTranslation] = useState([])

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    if (!inputText.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      translation: translation
    };

    setMessages([...messages, newMessage]);

    const response = await fetch('https://bfbe82c3ccbf.ngrok-free.app/english_translator', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      // 3. The body MUST match your Pydantic "DefinePrompt" class
      body: JSON.stringify({
        user_prompt: "Text you want to translate", // This matches 'user_prompt' in Python
        language: "Yoruba"                         // This matches 'language' in Python
      })
    });
    if (!response.ok){
      return "Failed to access translator";
    }

    try {
      data = await response.json();
      setTranslation(data);
    } 
    catch (e) {
      console.log(e);
    }
    setInputText('');
    setIsSending(false);
  };

  return (
    <div className="h-screen bg-[#0B0F19] text-white flex flex-col font-sans w-full relative">
      
      {/* --- Header --- */}
      <div className="p-6 border-b border-slate-800/50 flex flex-col gap-1 bg-[#0B0F19] z-10">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Scenario</h1>
            <span className="bg-green-900/30 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-800/50">
                Yoruba
            </span>
        </div>
        <p className="text-slate-400 text-sm font-medium">Interactive Roleplay • Beginner</p>
      </div>

      {/* --- Chat Area --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex flex-col max-w-2xl ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
                {/* Message Bubble */}
                <div className={`p-5 rounded-2xl relative shadow-lg
                    ${msg.sender === 'user' 
                        ? 'bg-green-600 text-white rounded-br-sm' 
                        : 'bg-[#1E293B] border border-slate-800 rounded-bl-sm text-slate-100'
                    }
                `}>
                    <p className="text-lg font-medium leading-relaxed">
                        {msg.text}
                    </p>
                    
                    {/* Translation (Only for AI usually) */}
                    {msg.translation && (
                        <p className="mt-3 text-slate-400 text-sm italic font-light border-t border-slate-700/50 pt-2">
                            "{msg.translation}"
                        </p>
                    )}
                </div>

                {/* Audio / Actions Row */}
                {msg.sender === 'ai' && (
                    <button className="mt-2 ml-1 text-slate-500 hover:text-green-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                        <Volume2 size={20} />
                    </button>
                )}
            </div>
        ))}
      </div>

      {/* --- Input Area --- */}
      <div className="p-6 bg-[#0B0F19]">
        <form 
            onSubmit={handleSend}
            className="max-w-4xl mx-auto flex items-center gap-4"
        >
            {/* Mic Button */}
            <button 
                type="button"
                className={`w-12 h-12 flex items-center justify-center rounded-full border border-green-600/50 transition-colors flex-shrink-0 ${
                    isTalking ? 'bg-green-900/20' : 'hover:bg-green-600/10 text-green-500'
                }`}
                onClick={handleTalk}
            >
                {/* Your Custom SVG Animation Logic */}
                {isTalking ? (
                   <svg fill="hsl(142, 76%, 36%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                      <circle cx="12" cy="12" r="0">
                        <animate attributeName="r" calcMode="spline" dur="1.2s" values="0;11" keySplines=".52,.6,.25,.99" repeatCount="indefinite"/>
                        <animate attributeName="opacity" calcMode="spline" dur="1.2s" values="1;0" keySplines=".52,.6,.25,.99" repeatCount="indefinite"/>
                      </circle>
                   </svg>
                ) : (
                   <Mic size={22} />
                )}
            </button>
            

            {/* Text Input */}
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isTalking ? "Listening..." : "Type your response..."}
                    className="w-full bg-[#1E293B] border border-slate-700 text-white placeholder-slate-500 px-6 py-4 rounded-2xl focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/50 transition-all"
                />
            </div>

            {/* Send Button */}
            <button 
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
                <Send size={24} className={!inputText.trim() ? 'opacity-50' : ''} />
            </button>
        </form>
      </div>

    </div>
  );
};

export default AITutor;