import React, { useState } from 'react';
import { OptionAnalysis, ProConItem, ImpactLevel } from '../types/decision';
import {
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ShieldCheck,
  Tag,
  Sparkles,
} from 'lucide-react';

interface ProsConsViewProps {
  options: OptionAnalysis[];
  onAddProCon: (optionId: string, type: 'pro' | 'con', item: ProConItem) => void;
  onDeleteProCon: (optionId: string, type: 'pro' | 'con', itemId: string) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  options,
  onAddProCon,
  onDeleteProCon,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'single'>(
    options.length <= 2 ? 'sideBySide' : 'single'
  );

  // New factor form state
  const [activeAddingOption, setActiveAddingOption] = useState<string | null>(null);
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [newPoint, setNewPoint] = useState('');
  const [newImpact, setNewImpact] = useState<ImpactLevel>('high');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newMitigation, setNewMitigation] = useState('');

  const currentOption = options.find((opt) => opt.id === selectedOptionId) || options[0];

  const handleCreateProCon = (optionId: string) => {
    if (!newPoint.trim()) return;

    const newItem: ProConItem = {
      id: 'custom_' + Date.now().toString(36),
      point: newPoint.trim(),
      impact: newImpact,
      category: newCategory.trim() || 'General',
      mitigation: newType === 'con' && newMitigation.trim() ? newMitigation.trim() : undefined,
    };

    onAddProCon(optionId, newType, newItem);
    setNewPoint('');
    setNewMitigation('');
    setActiveAddingOption(null);
  };

  const getImpactBadge = (impact: ImpactLevel, isPro: boolean) => {
    const base = 'px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ';
    if (isPro) {
      switch (impact) {
        case 'high':
          return base + 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        case 'medium':
          return base + 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        default:
          return base + 'bg-slate-100 text-slate-600 border border-slate-200';
      }
    } else {
      switch (impact) {
        case 'high':
          return base + 'bg-rose-100 text-rose-800 border border-rose-200';
        case 'medium':
          return base + 'bg-rose-50 text-rose-700 border border-rose-200';
        default:
          return base + 'bg-slate-100 text-slate-600 border border-slate-200';
      }
    }
  };

  const renderOptionCard = (option: OptionAnalysis) => {
    const pros = option.pros || [];
    const cons = option.cons || [];
    const isAddingHere = activeAddingOption === option.id;

    return (
      <div
        key={option.id}
        className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
      >
        {/* Option Header */}
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">{option.name}</h3>
              <span className="text-xs font-medium text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                {pros.length} Pros / {cons.length} Cons
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{option.tagline}</p>
          </div>

          <button
            onClick={() => {
              setActiveAddingOption(isAddingHere ? null : option.id);
              setNewType('pro');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Factor</span>
          </button>
        </div>

        {/* Inline Add Factor Form */}
        {isAddingHere && (
          <div className="mb-5 p-4 rounded-xl bg-blue-50/50 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Add Factor to {option.name}
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setNewType('pro')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    newType === 'pro'
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pro (+)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('con')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    newType === 'con'
                      ? 'bg-rose-100 text-rose-800 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Con (-)
                </button>
              </div>
            </div>

            <input
              type="text"
              value={newPoint}
              onChange={(e) => setNewPoint(e.target.value)}
              placeholder={newType === 'pro' ? 'Describe the advantage or upside...' : 'Describe the drawback or risk...'}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 mb-2"
            />

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Impact Level</label>
                <select
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value as ImpactLevel)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs"
                >
                  <option value="high">High Impact</option>
                  <option value="medium">Medium Impact</option>
                  <option value="low">Low Impact</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Financial, Career, Time"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs"
                />
              </div>
            </div>

            {newType === 'con' && (
              <div className="mb-3">
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  How can you mitigate this risk? (Optional)
                </label>
                <input
                  type="text"
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  placeholder="e.g. Set boundaries, negotiate flexible hours..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-100">
              <button
                type="button"
                onClick={() => setActiveAddingOption(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCreateProCon(option.id)}
                disabled={!newPoint.trim()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Pros & Cons Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {/* Pros Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider pb-2 mb-3 border-b border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pros & Advantages ({pros.length})</span>
            </div>

            <div className="space-y-2.5 flex-1">
              {pros.map((pro) => (
                <div
                  key={pro.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 hover:border-emerald-300 hover:bg-white transition group relative"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={getImpactBadge(pro.impact, true)}>
                      {pro.impact} impact
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        <Tag className="w-2.5 h-2.5" />
                        {pro.category}
                      </span>
                      <button
                        onClick={() => onDeleteProCon(option.id, 'pro', pro.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition p-0.5"
                        title="Remove pro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {pro.point}
                  </p>
                </div>
              ))}
              {pros.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4 text-center">No pros listed yet.</p>
              )}
            </div>
          </div>

          {/* Cons Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs uppercase tracking-wider pb-2 mb-3 border-b border-rose-100">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Cons & Drawbacks ({cons.length})</span>
            </div>

            <div className="space-y-2.5 flex-1">
              {cons.map((con) => (
                <div
                  key={con.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 hover:border-rose-300 hover:bg-white transition group relative"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={getImpactBadge(con.impact, false)}>
                      {con.impact} impact
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        <Tag className="w-2.5 h-2.5" />
                        {con.category}
                      </span>
                      <button
                        onClick={() => onDeleteProCon(option.id, 'con', con.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition p-0.5"
                        title="Remove con"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-medium mb-2">
                    {con.point}
                  </p>

                  {/* Mitigation Strategy */}
                  {con.mitigation && (
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200/80 flex items-start gap-2 text-[11px] text-blue-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-blue-800 font-bold block text-[10px] uppercase tracking-wider">
                          De-Risking Strategy:
                        </strong>
                        <span>{con.mitigation}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {cons.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4 text-center">No cons listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Option filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
            Showing Option:
          </span>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setSelectedOptionId(opt.id);
                if (viewMode === 'sideBySide' && options.length > 2) {
                  setViewMode('single');
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedOptionId === opt.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {/* Side-by-side vs single toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
              viewMode === 'sideBySide'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
              viewMode === 'single'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Single Focus
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'sideBySide' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {options.map((opt) => renderOptionCard(opt))}
        </div>
      ) : (
        renderOptionCard(currentOption)
      )}
    </div>
  );
};
