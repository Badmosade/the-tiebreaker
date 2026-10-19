import React, { useState } from 'react';
import { DecisionVerdict, OptionAnalysis } from '../types/decision';
import {
  HelpCircle,
  DoorOpen,
  ListOrdered,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface VerdictViewProps {
  verdict: DecisionVerdict;
  options: OptionAnalysis[];
  isResolved: boolean;
  chosenOptionId?: string;
  onCommitDecision: (optionId: string) => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  options,
  isResolved,
  chosenOptionId,
  onCommitDecision,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCommitId, setSelectedCommitId] = useState<string>(
    chosenOptionId || verdict.recommendedOptionId
  );

  const recommendedOption = options.find(
    (opt) => opt.id === verdict.recommendedOptionId
  ) || options[0];

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `The Tiebreaker recommends: ${verdict.recommendedOptionName}. Confidence is ${verdict.confidencePercent} percent. ${verdict.tiebreakerReasoning} The decisive crux question is: ${verdict.theCruxQuestion}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const isType1 = verdict.decisionType === 'type1_irreversible';

  return (
    <div className="space-y-5">
      {/* Hero Recommendation Card */}
      <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-6 sm:p-7 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> The Tiebreaker Verdict
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
              Recommended: {verdict.recommendedOptionName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {recommendedOption?.tagline || 'The strategically superior choice.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {'speechSynthesis' in window && (
              <button
                onClick={handleToggleSpeech}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}

            <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Confidence
              </div>
              <div className="text-xl font-black text-blue-800 font-heading">
                {verdict.confidencePercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="py-5 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Why This Choice Wins
          </h3>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {verdict.tiebreakerReasoning}
          </p>
        </div>

        {/* Litmus Question Callout */}
        <div className="mt-5 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              The Crux Question (Litmus Test)
            </h4>
            <p className="text-sm font-semibold text-slate-900 mt-0.5 italic">
              "{verdict.theCruxQuestion}"
            </p>
          </div>
        </div>
      </div>

      {/* Reversibility & Devil's Advocate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type 1 vs Type 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-blue-600" />
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Reversibility Framework
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                  isType1
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {isType1 ? 'One-Way Door (Type 1)' : 'Two-Way Door (Type 2)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {verdict.decisionTypeExplanation}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            {isType1 ? 'High switching cost: take measured steps.' : 'Low switching cost: favor speed and experimentation.'}
          </div>
        </div>

        {/* Devil's Advocate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Devil's Advocate
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-800 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                Blind Spot
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {verdict.devilsAdvocate}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400">
            Consider this potential risk before committing.
          </div>
        </div>
      </div>

      {/* Concrete Next Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
          <ListOrdered className="w-4 h-4 text-blue-600" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            3 Concrete Next Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {verdict.actionSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mb-2">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution & Commitment Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready to finalize this decision?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Lock in your chosen option to track your outcome and resolve dilemma.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedCommitId}
            onChange={(e) => setSelectedCommitId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium focus:outline-none"
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Choose: {opt.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onCommitDecision(selectedCommitId)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer whitespace-nowrap"
          >
            <span>{isResolved ? 'Update Choice' : 'Finalize Decision'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
