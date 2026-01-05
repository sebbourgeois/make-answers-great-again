
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

interface TrumpResponseProps {
  answer: string;
  isStreaming: boolean;
}

const TrumpResponse: React.FC<TrumpResponseProps> = ({ answer, isStreaming }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeech = async () => {
    if (isSpeaking || !answer) return;
    setIsSpeaking(true);
    
    const audioData = await geminiService.generateTrumpSpeech(answer);
    if (audioData) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioData.buffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  if (!answer && !isStreaming) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white text-black p-1 shadow-[20px_20px_0px_0px_rgba(212,175,55,0.8)] border-4 border-black">
      <div className="border-2 border-black p-8 bg-white relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#002868] text-white px-6 py-1 font-black text-sm uppercase tracking-[0.2em] border-2 border-black">
          Official Statement
        </div>
        
        <div className="mb-6 flex justify-center">
            <img src="https://picsum.photos/seed/eagle/200/200" alt="Seal" className="w-16 h-16 grayscale brightness-0" />
        </div>

        <p className="text-2xl md:text-3xl font-black leading-tight mb-8 serif-title italic">
          "{answer}{isStreaming && <span className="inline-block w-3 h-8 bg-[#D4AF37] animate-pulse ml-1"></span>}"
        </p>

        <div className="flex flex-wrap items-center justify-between border-t-2 border-black pt-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-[#BF0A30] flex items-center justify-center text-white font-black text-xl">TRUMP</div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest leading-none">Donald J. Trump</p>
              <p className="text-[10px] text-gray-600 uppercase font-bold">45th President of the United States</p>
            </div>
          </div>

          <button
            onClick={handleSpeech}
            disabled={isStreaming || isSpeaking}
            className="bg-black text-white px-6 py-2 font-black uppercase text-sm hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-30 flex items-center gap-2"
          >
            {isSpeaking ? (
              <>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-current animate-bounce"></div>
                  <div className="w-1 h-3 bg-current animate-bounce delay-75"></div>
                  <div className="w-1 h-3 bg-current animate-bounce delay-150"></div>
                </div>
                Speaking...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-.9 7-4.6 7-9.03s-3-8.13-7-9.03zm-3 .77L6.5 8H3v8h3.5L11 20V4z"/></svg>
                Hear the Truth
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrumpResponse;
