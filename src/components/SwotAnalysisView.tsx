import React, { useState } from 'react';
import { OptionAnalysis } from '../types/decision';
import { Shield, Zap, TrendingUp, AlertTriangle, Lightbulb, Compass } from 'lucide-react';

interface SwotAnalysisViewProps {
  options: OptionAnalysis[];
}

export const SwotAnalysisView: React.FC<SwotAnalysisViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const activeOption = options.find((opt) => opt.id === selectedOptionId) || options[0];

  if (!activeOption) return null;

  const { swot } = activeOption;

  return (
    <div className="space-y-5">
      {/* Option Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            SWOT for Option:
          </span>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
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

        <div className="text-xs text-slate-500 hidden md:block">
          {activeOption.tagline}
        </div>
      </div>

      {/* SWOT 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Strengths */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-emerald-700">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h4 className="font-heading font-bold text-sm">
                Strengths (Internal)
              </h4>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              Upsides
            </span>
          </div>

          <ul className="space-y-2 flex-1">
            {swot.strengths.map((str, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed p-2 rounded-lg bg-slate-50/70 border border-slate-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
            {swot.strengths.length === 0 && (
              <li className="text-xs text-slate-400 italic">No strengths listed.</li>
            )}
          </ul>
        </div>

        {/* 2. Weaknesses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="font-heading font-bold text-sm">
                Weaknesses (Internal)
              </h4>
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-800 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
              Vulnerabilities
            </span>
          </div>

          <ul className="space-y-2 flex-1">
            {swot.weaknesses.map((weak, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed p-2 rounded-lg bg-slate-50/70 border border-slate-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
            {swot.weaknesses.length === 0 && (
              <li className="text-xs text-slate-400 italic">No weaknesses listed.</li>
            )}
          </ul>
        </div>

        {/* 3. Opportunities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-heading font-bold text-sm">
                Opportunities (External)
              </h4>
            </div>
            <span className="text-[10px] uppercase font-bold text-blue-800 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Future Growth
            </span>
          </div>

          <ul className="space-y-2 flex-1">
            {swot.opportunities.map((opp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed p-2 rounded-lg bg-slate-50/70 border border-slate-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{opp}</span>
              </li>
            ))}
            {swot.opportunities.length === 0 && (
              <li className="text-xs text-slate-400 italic">No opportunities listed.</li>
            )}
          </ul>
        </div>

        {/* 4. Threats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-rose-700">
              <Shield className="w-4 h-4 text-rose-600" />
              <h4 className="font-heading font-bold text-sm">
                Threats (External)
              </h4>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-800 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
              External Risks
            </span>
          </div>

          <ul className="space-y-2 flex-1">
            {swot.threats.map((thr, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed p-2 rounded-lg bg-slate-50/70 border border-slate-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{thr}</span>
              </li>
            ))}
            {swot.threats.length === 0 && (
              <li className="text-xs text-slate-400 italic">No threats listed.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Strategic Playbook Note */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-blue-900 font-semibold">Strategic Takeaway for {activeOption.name}: </strong>
          Use your key Strengths to seize external Opportunities, while setting up defensive boundaries against identified Threats.
        </div>
      </div>
    </div>
  );
};
