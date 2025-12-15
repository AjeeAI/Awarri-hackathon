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
  
  // State to hold the chat history
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Good morning. I have very beautiful lace. What do you want to buy?",
      language: "Yoruba",
      translation: 'E kaaro o! Mo ni lace to rewa gan. Ki le fe ra?',
    }
  ]);

  // Ref to hold the Speech Recognition instance
  const recognitionRef = useRef(null);

  // Initialize Speech Logic on Mount
  // useEffect(() => {
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
  //   if (SpeechRecognition) {
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.lang = 'en-US';
  //     recognitionRef.current.continuous = true; 
  //     recognitionRef.current.interimResults = true;

  //     recognitionRef.current.onresult = (event) => {
  //       const transcript = Array.from(event.results)
  //         .map(result => result[0].transcript)
  //         .join('');
  //       setInputText(transcript);
  //     };

  //     recognitionRef.current.onend = () => {
  //       setIsTalking(false);
  //     };

  //     recognitionRef.current.onerror = (event) => {
  //       if (event.error !== 'no-speech') {
  //           setIsTalking(false);
  //       }
  //     };
  //   }

  //   return () => {
  //     if (recognitionRef.current) recognitionRef.current.stop();
  //   };
  // }, []);

  const handleTalk = () => {
    if (!recognitionRef.current) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    if (!isTalking) {
      try {
        // Mic is activated here
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

  const handleSpeak = async (text, language) => {
    try {
      const response = await fetch("https://8000-01kbncv6hstyfzvadn6zffk7f9.cloudspaces.litng.ai/english_translator_voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // CHANGE THIS LINE:
          user_prompt: text,   // Backend expects 'user_prompt', not 'text'
          language: language
        })
      });

      if (!response.ok) throw new Error("Audio fetch failed");

      // Convert response to audio blob and play it
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error("Speech Error:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSending(true);

    // 1. Add User Message (Right side)
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      translation: null 
    };

    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputText;
    setInputText(''); 

    try {
        const response = await fetch('https://8000-01kbncv6hstyfzvadn6zffk7f9.cloudspaces.litng.ai/english_translator', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_prompt: currentInput, 
            language: "Yoruba" 
          })
        });
    
        if (!response.ok) {
          throw new Error("Failed to access translator");
        }
    
        const data = await response.json();
        
        // 2. Add AI Response (Left side) containing the translation
        const aiMessage = {
            id: Date.now() + 1, 
            sender: 'ai',       
            text: data.Translation, // The translation text
            language: "Yoruba"
        };

        setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
        console.error("Translation Error:", error);
    } finally {
        setIsSending(false);
    }
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
                <div className={`p-5 rounded-2xl relative shadow-lg
                    ${msg.sender === 'user' 
                        ? 'bg-green-600 text-white rounded-br-sm' 
                        : 'bg-[#1E293B] border border-slate-800 rounded-bl-sm text-slate-100'
                    }
                `}>
                    <p className="text-lg font-medium leading-relaxed">
                        {msg.text}
                    </p>
                </div>

                {/* --- FIXED: Audio Button --- */}
                {msg.sender === 'ai' && (
                    <button className="mt-2 ml-1 text-slate-500 hover:text-green-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                        <Volume2 
                            size={20} 
                            // CORRECTED LINE BELOW:
                            onClick={() => handleSpeak(msg.text, msg.language || "Yoruba")}
                        />
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
            <button 
                type="button"
                className={`w-12 h-12 flex items-center justify-center rounded-full border border-green-600/50 transition-colors flex-shrink-0 ${
                    isTalking ? 'bg-green-900/20' : 'hover:bg-green-600/10 text-green-500'
                }`}
                onClick={handleTalk}
            >
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
            
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isTalking ? "Listening..." : "Type your response..."}
                    className="w-full bg-[#1E293B] border border-slate-700 text-white placeholder-slate-500 px-6 py-4 rounded-2xl focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/50 transition-all"
                />
            </div>

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