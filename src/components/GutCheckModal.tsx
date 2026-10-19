import React, { useState } from 'react';
import { X, Sparkles, RotateCcw, Heart, Brain } from 'lucide-react';
import { OptionAnalysis } from '../types/decision';

interface GutCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: OptionAnalysis[];
}

export const GutCheckModal: React.FC<GutCheckModalProps> = ({
  isOpen,
  onClose,
  options,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [resultOption, setResultOption] = useState<OptionAnalysis | null>(null);

  if (!isOpen || options.length < 2) return null;

  const optA = options[0];
  const optB = options[1];

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResultOption(null);

    setTimeout(() => {
      const randomIdx = Math.random() < 0.5 ? 0 : 1;
      setResultOption(options[randomIdx]);
      setIsFlipping(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl relative text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Heart className="w-5 h-5 fill-blue-100" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 font-heading">
          The Coin Flip Gut-Check
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          The coin flip doesn't decide for you—your emotional reaction to the result tells you what you truly desire.
        </p>

        {/* Coin */}
        <div className="my-6 flex justify-center">
          <div
            className={`w-28 h-28 rounded-full border-4 border-blue-500 bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex flex-col items-center justify-center shadow-md shadow-blue-500/20 transition-all transform ${
              isFlipping
                ? 'animate-spin scale-95 opacity-80'
                : 'hover:scale-105 cursor-pointer'
            }`}
            onClick={handleFlip}
          >
            <div className="w-24 h-24 rounded-full border-2 border-blue-300 bg-white flex flex-col items-center justify-center p-2 text-center">
              {isFlipping ? (
                <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
              ) : resultOption ? (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Result
                  </span>
                  <span className="text-xs font-bold text-slate-900 line-clamp-2 px-1">
                    {resultOption.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-heading">
                    Flip
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {optA.name} vs {optB.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Psychological Result */}
        {resultOption && !isFlipping && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-5">
            <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Brain className="w-4 h-4 text-blue-600" /> Reaction Check:
            </div>
            <p className="text-xs text-slate-700 font-medium mb-2">
              When it landed on <strong className="text-blue-700">"{resultOption.name}"</strong>:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                • If you felt <strong>relief</strong>, your subconscious favors <em>{resultOption.name}</em>.
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                • If you felt <strong>disappointed</strong> and wished for the other, your gut has already chosen the alternative!
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{resultOption ? 'Flip Again' : 'Flip The Coin'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
