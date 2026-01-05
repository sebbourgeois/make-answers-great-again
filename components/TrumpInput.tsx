
import React, { useState } from 'react';

interface TrumpInputProps {
  onAsk: (question: string) => void;
  isLoading: boolean;
}

const TrumpInput: React.FC<TrumpInputProps> = ({ onAsk, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onAsk(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a Tremendous Question..."
          className="w-full bg-black/50 border-4 border-[#D4AF37] p-6 pr-32 text-xl font-bold rounded-none focus:outline-none focus:ring-4 focus:ring-[#BF0A30]/50 placeholder-gray-500 text-[#D4AF37] transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 bottom-2 bg-[#BF0A30] hover:bg-[#a00828] text-white px-8 font-black uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Thinking...' : 'ASK'}
        </button>
      </div>
    </form>
  );
};

export default TrumpInput;
