import React from 'react';
import { Scale, History, Coins, PlusCircle, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { DecisionRecord } from '../types/decision';

interface HeaderProps {
  currentDecision: DecisionRecord | null;
  historyCount: number;
  onOpenHistory: () => void;
  onNewDecision: () => void;
  onOpenGutCheck: () => void;
  onOpenExport: () => void;
  onToggleResolved: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDecision,
  historyCount,
  onOpenHistory,
  onNewDecision,
  onOpenGutCheck,
  onOpenExport,
  onToggleResolved,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 text-white font-bold">
            <Scale className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
                The Tiebreaker
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" /> Decision Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Clear, objective AI decision analysis
            </p>
          </div>
        </div>

        {/* Center status if current decision is resolved */}
        {currentDecision && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <button
              onClick={onToggleResolved}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                currentDecision.status === 'resolved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
              title="Click to toggle decision resolution"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-current" />
              {currentDecision.status === 'resolved' ? 'Resolved' : 'In Progress'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Gut Check Coin Flip */}
          {currentDecision && (
            <button
              onClick={onOpenGutCheck}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition shadow-xs"
              title="Coin flip gut check"
            >
              <Coins className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Gut Check</span>
            </button>
          )}

          {/* Export / Share */}
          {currentDecision && (
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition shadow-xs"
              title="Export summary"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Export</span>
            </button>
          )}

          {/* Saved History */}
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition shadow-xs relative"
            title="Saved Decisions"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                {historyCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          <button
            onClick={onNewDecision}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm shadow-blue-600/10 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
