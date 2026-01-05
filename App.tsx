
import React, { useState } from 'react';
import TrumpInput from './components/TrumpInput';
import TrumpResponse from './components/TrumpResponse';
import { geminiService } from './services/geminiService';
import { SUGGESTED_QUESTIONS, EagleIcon } from './constants';

const App: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleAsk = async (question: string) => {
    setShowIntro(false);
    setAnswer('');
    setIsStreaming(true);

    try {
      const stream = geminiService.generateTrumpAnswerStream(question);
      for await (const chunk of stream) {
        setAnswer((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Failed to get answer:", error);
      setAnswer("The fake news media is blocking the signal! This is a disaster. Try again, it's going to be tremendous.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 pt-12 md:pt-20 relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#BF0A30] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#002868] blur-[150px] rounded-full"></div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-6xl z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
            <EagleIcon />
            <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 italic">
            THE <span className="text-[#D4AF37]">PRESIDENTIAL</span> <br />
            ANSWER MACHINE
          </h1>
          <p className="text-xl md:text-2xl font-bold text-[#D4AF37] uppercase tracking-widest">
            High Energy. Total Winning. Tremendous Words.
          </p>
        </header>

        <TrumpInput onAsk={handleAsk} isLoading={isStreaming} />

        {showIntro ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="col-span-full mb-4">
              <h2 className="text-center text-sm font-black uppercase tracking-widest text-gray-500">Suggested Topics for a Great Answer</h2>
            </div>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(q)}
                disabled={isStreaming}
                className="bg-zinc-900/80 border-2 border-zinc-800 p-6 text-left hover:border-[#D4AF37] hover:bg-black transition-all group"
              >
                <p className="text-gray-400 font-bold text-xs uppercase mb-2 group-hover:text-[#D4AF37]">Tremendous Topic {idx + 1}</p>
                <p className="font-bold text-lg leading-tight">{q}</p>
              </button>
            ))}
          </div>
        ) : (
          <TrumpResponse answer={answer} isStreaming={isStreaming} />
        )}
      </main>

      <footer className="mt-auto py-12 text-center w-full max-w-4xl opacity-50 text-xs font-bold uppercase tracking-widest border-t border-white/10">
        <div className="flex justify-center gap-8 mb-4">
          <span>MAGA-READY TECH</span>
          <span>NO FAKE NEWS</span>
          <span>BEST IN CLASS AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} The Presidential Answer Machine. Authorized by the Dept. of Winning.</p>
      </footer>

      {/* Side "Patriotic" Bar Decorations */}
      <div className="fixed left-0 top-0 bottom-0 w-2 bg-[#BF0A30] hidden md:block"></div>
      <div className="fixed left-4 top-0 bottom-0 w-1 bg-[#D4AF37] hidden md:block"></div>
      <div className="fixed right-0 top-0 bottom-0 w-2 bg-[#002868] hidden md:block"></div>
      <div className="fixed right-4 top-0 bottom-0 w-1 bg-[#D4AF37] hidden md:block"></div>
    </div>
  );
};

export default App;
