import React, { useState } from 'react';
import { X, Search, Trash2, Calendar, CheckCircle2, Clock, ChevronRight, Scale } from 'lucide-react';
import { DecisionRecord } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionRecord[];
  onSelectDecision: (decision: DecisionRecord) => void;
  onDeleteDecision: (id: string) => void;
  onClearHistory: () => void;
  activeId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDecision,
  onDeleteDecision,
  onClearHistory,
  activeId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.options.some((o) => o.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Saved Decisions ({history.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decisions or keywords..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {searchQuery ? 'No decisions match your search.' : 'No saved decisions yet.'}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isActive = item.id === activeId;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all relative group cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                  onClick={() => {
                    onSelectDecision(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {item.status === 'resolved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> In Progress
                        </>
                      )}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Delete decision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-2 mb-1">
                    {item.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {item.options.map((o) => o.name).join(' vs. ')}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>

                    <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                      Open <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">Saved in browser</span>
            <button
              onClick={() => {
                if (window.confirm('Clear all saved decisions?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-slate-500 hover:text-rose-600 transition font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
