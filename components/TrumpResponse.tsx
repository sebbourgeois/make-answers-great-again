
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { toPng } from 'html-to-image';

interface TrumpResponseProps {
  answer: string;
  isStreaming: boolean;
}

const TrumpResponse: React.FC<TrumpResponseProps> = ({ answer, isStreaming }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSpeech = async () => {
    if (isSpeaking) {
      audioSourceRef.current?.stop();
      setIsSpeaking(false);
      return;
    }

    if (!answer) return;
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
      
      audioSourceRef.current = source;
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      // Filter out buttons from the captured image
      const filter = (node: HTMLElement) => {
        const exclusionClasses = ['action-buttons-container'];
        return !exclusionClasses.some(cls => node.classList?.contains(cls));
      };

      const dataUrl = await toPng(cardRef.current, { 
        filter: filter as any,
        backgroundColor: '#ffffff',
        pixelRatio: 3, // Higher quality
        skipFonts: false,
      });

      const link = document.createElement('a');
      link.download = `Trump_Official_Statement_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  if (!answer && !isStreaming) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white text-black p-1 shadow-[25px_25px_0px_0px_rgba(212,175,55,0.9)] border-4 border-black transition-all relative">
      <div 
        ref={cardRef}
        className="border-2 border-black p-8 md:p-14 bg-white relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"
      >
        {/* Decorative Stamp Background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center z-0">
           <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Seal_of_the_President_of_the_United_States.svg" alt="Watermark" className="w-[70%] grayscale -rotate-12" />
        </div>

        {/* Animated Background when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 bg-red-50/40 animate-pulse pointer-events-none z-0"></div>
        )}

        {/* Top Labels - Official Statement Tag */}
        <div className="flex justify-center mb-12 relative z-20">
            <div className="bg-[#002868] text-white px-8 md:px-12 py-3 font-black text-sm md:text-base uppercase tracking-[0.2em] border-2 border-black shadow-lg text-center whitespace-nowrap min-w-[280px]">
              Official Statement
            </div>
            {isSpeaking && (
                <div className="absolute top-0 right-0 bg-[#BF0A30] text-white px-4 py-2 font-black text-sm uppercase animate-pulse border-2 border-black shadow-lg">
                    LIVE
                </div>
            )}
        </div>
        
        {/* Presidential Header */}
        <div className="mb-14 flex flex-col items-center relative z-10">
            <div className="relative mb-6">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/Seal_of_the_President_of_the_United_States.svg" 
                    alt="Seal" 
                    className="w-28 h-28 drop-shadow-xl" 
                />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] leading-normal mb-1">The White House</h2>
                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-600">Office of Donald J. Trump</p>
            </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 min-h-[220px] flex flex-col items-center justify-center">
            <p className="text-3xl md:text-5xl font-black leading-tight mb-16 serif-title italic text-center px-6 text-zinc-900">
              "{answer}{isStreaming && <span className="inline-block w-4 h-12 bg-[#D4AF37] animate-pulse ml-1 align-middle"></span>}"
            </p>
        </div>

        {/* Audio Visualizer (Hidden in capture via filter) */}
        {isSpeaking && (
            <div className="action-buttons-container flex justify-center items-end gap-1 mb-8 h-10 relative z-10">
                {[...Array(24)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1.5 md:w-2 bg-[#BF0A30] rounded-t-sm" 
                        style={{ 
                            height: `${10 + Math.random() * 90}%`,
                            animation: `bounce 0.6s ease-in-out infinite ${i * 0.03}s`
                        }}
                    ></div>
                ))}
            </div>
        )}

        {/* Closing & Signature Section */}
        <div className="flex flex-col md:flex-row items-end justify-between border-t-4 border-black pt-12 gap-8 relative z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="w-20 h-20 bg-[#BF0A30] flex items-center justify-center text-white font-black text-3xl border-2 border-black transform -rotate-3 shadow-md">DJT</div>
            <div>
              <div className="signature-font text-4xl mb-2 text-zinc-800 opacity-90 select-none pb-2">Donald J. Trump</div>
              <div className="border-t border-black pt-2">
                <p className="font-black uppercase text-base tracking-widest leading-none">Donald J. Trump</p>
                <p className="text-[11px] text-gray-700 uppercase font-bold tracking-tight mt-1">45th President of the United States</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Container - Excluded from image download */}
          <div className="action-buttons-container flex flex-wrap gap-3 justify-center md:justify-end">
              <button
                onClick={handleDownloadImage}
                disabled={isStreaming || !answer}
                className="bg-black text-white px-6 py-3 font-black uppercase text-xs transition-all flex items-center gap-2 border-2 border-black hover:bg-[#D4AF37] hover:text-black shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                SAVE PICTURE
              </button>

              <button
                onClick={handleSpeech}
                disabled={isStreaming}
                className={`px-6 py-3 font-black uppercase text-sm transition-all flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none ${
                  isSpeaking 
                  ? 'bg-[#BF0A30] text-white' 
                  : 'bg-[#D4AF37] text-black hover:bg-black hover:text-[#D4AF37]'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <div className="w-3 h-3 bg-white animate-ping rounded-full"></div>
                    STOP
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-.9 7-4.6 7-9.03s-3-8.13-7-9.03zm-3 .77L6.5 8H3v8h3.5L11 20V4z"/></svg>
                    SPEAK
                  </>
                )}
              </button>
          </div>
        </div>

        {/* Authenticity Stamps */}
        <div className="absolute bottom-10 right-10 opacity-30 pointer-events-none transform rotate-12 flex flex-col items-center">
             <div className="border-4 border-[#BF0A30] p-2 rounded-full w-24 h-24 flex items-center justify-center text-center leading-none mb-2">
                 <div className="text-[12px] font-black text-[#BF0A30] uppercase">
                     Total<br/>Winning<br/>Certified
                 </div>
             </div>
             <div className="bg-[#D4AF37] text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter border border-black rotate-[-15deg]">
                 MAGA APPROVED
             </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
            0%, 100% { transform: scaleY(0.2); opacity: 0.5; }
            50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TrumpResponse;
