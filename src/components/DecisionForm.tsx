import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  ListFilter,
  Sliders,
  Grid2X2,
  Check,
} from 'lucide-react';
import { AnalyzeDecisionRequest, AnalysisType } from '../types/decision';

interface PresetItem {
  title: string;
  decision: string;
  options: string[];
  priorities: string[];
  context: string;
}

interface DecisionFormProps {
  onSubmit: (data: AnalyzeDecisionRequest) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
  hasActiveDecision?: boolean;
  defaultAnalysis?: AnalysisType;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onCancel,
  hasActiveDecision,
  defaultAnalysis = 'proscons',
}) => {
  const [decision, setDecision] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>(defaultAnalysis);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [priorityInput, setPriorityInput] = useState('');
  const [context, setContext] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const presets: PresetItem[] = [
    {
      title: 'Startup vs. Corporate',
      decision: 'Should I leave my secure corporate engineering role to join an early-stage AI startup as Lead Engineer?',
      options: ['Join Early-Stage Startup', 'Stay at Corporate Role'],
      priorities: ['Financial Upside', 'Work-Life Balance', 'Learning Velocity'],
      context: '6 months emergency fund saved, interested in high growth.',
    },
    {
      title: 'Buy vs. Rent & Invest',
      decision: 'Should I purchase a home now or continue renting in the city center while investing the surplus in index funds?',
      options: ['Buy Suburban Home', 'Rent & Invest Difference'],
      priorities: ['Long-term Wealth', 'Flexibility & Commute', 'Maintenance Overhead'],
      context: 'Planning to remain in the area for 5+ years.',
    },
    {
      title: 'Relocate vs. Stay Put',
      decision: 'Should I move to a new city with lower taxes and better weather, or stay where I have established personal roots?',
      options: ['Relocate to New City', 'Stay in Current City'],
      priorities: ['Community & Roots', 'Cost of Living', 'Lifestyle & Weather'],
      context: 'Work is fully remote, seeking a fresh lifestyle.',
    },
  ];

  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleApplyPreset = (preset: PresetItem) => {
    setDecision(preset.decision);
    setOptions(preset.options);
    setPriorities(preset.priorities);
    setContext(preset.context);
  };

  const handleAddOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddPriority = () => {
    if (priorityInput.trim() && !priorities.includes(priorityInput.trim())) {
      setPriorities([...priorities, priorityInput.trim()]);
      setPriorityInput('');
    }
  };

  const handleRemovePriority = (p: string) => {
    setPriorities(priorities.filter((item) => item !== p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || isLoading) return;

    onSubmit({
      decision: decision.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
      priorities: priorities.length > 0 ? priorities : undefined,
      context: context.trim() || undefined,
      preferredAnalysis: selectedAnalysis,
    });
  };

  const loadingMessages = [
    'Structuring your decision and contrasting options...',
    'Evaluating pros, cons and risk mitigations...',
    'Generating comparison metrics and SWOT insights...',
    'Finalizing recommendations and verdict...',
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {isLoading ? (
        <div className="bg-white border border-blue-200 rounded-2xl p-8 sm:p-12 text-center shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-5 text-blue-600 shadow-sm animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">
            The Tiebreaker is Analyzing Your Decision
          </h3>

          <p className="text-sm text-blue-600 font-medium h-6">
            {loadingMessages[loadingStep]}
          </p>

          <div className="grid grid-cols-4 gap-2 w-full max-w-md mx-auto mt-6 mb-4">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  loadingStep >= step ? 'bg-blue-600' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-slate-500 flex items-center justify-center gap-1.5 mt-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            Analyzing trade-offs and building your preferred view
          </span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              Decision Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
              What decision do you need to make?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your dilemma below and select the type of analysis you want to see.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Quick examples:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-medium transition cursor-pointer"
              >
                {preset.title}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Decision Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Dilemma or Choice <span className="text-blue-600">*</span>
              </label>
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g. Should I accept the job offer at Company A or stay at my current job? Or: Should we buy our first house or keep renting?"
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-400"
              />
            </div>

            {/* Analysis Preference Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Which analysis would you prefer to view? <span className="text-blue-600">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Pros & Cons List */}
                <button
                  type="button"
                  onClick={() => setSelectedAnalysis('proscons')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedAnalysis === 'proscons'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedAnalysis === 'proscons'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ListFilter className="w-4 h-4" />
                    </div>
                    {selectedAnalysis === 'proscons' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      Pros & Cons List
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clear upsides & drawbacks with risk mitigation strategies
                    </p>
                  </div>
                </button>

                {/* 2. Comparison Table */}
                <button
                  type="button"
                  onClick={() => setSelectedAnalysis('comparison')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedAnalysis === 'comparison'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedAnalysis === 'comparison'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                    </div>
                    {selectedAnalysis === 'comparison' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      Comparison Table
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Multi-criteria matrix with customizable weights
                    </p>
                  </div>
                </button>

                {/* 3. SWOT Analysis */}
                <button
                  type="button"
                  onClick={() => setSelectedAnalysis('swot')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedAnalysis === 'swot'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedAnalysis === 'swot'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Grid2X2 className="w-4 h-4" />
                    </div>
                    {selectedAnalysis === 'swot' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      SWOT Analysis
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Strengths, Weaknesses, Opportunities & Threats
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
              >
                {showAdvanced ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Hide specific options & constraints</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Add specific options or constraints (Optional)</span>
                  </>
                )}
              </button>
            </div>

            {/* Collapsed Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                {/* Specific Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">
                      Options to Compare
                    </label>
                    {options.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Option
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 text-xs text-slate-500 font-semibold">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(i, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + i)} (or leave blank for AI to propose)`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(i)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priorities */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    What matters most to you?
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={priorityInput}
                      onChange={(e) => setPriorityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPriority();
                        }
                      }}
                      placeholder="e.g. Work-life balance, Financial upside, Low risk"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPriority}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  {priorities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {priorities.map((p, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
                        >
                          <span>{p}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePriority(p)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Context */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Any constraints or context?
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. 6 months savings, family considerations, non-negotiable remote work"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              {hasActiveDecision && onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
                >
                  Return to Active Decision
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={!decision.trim() || isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 disabled:opacity-50 transition cursor-pointer"
              >
                <span>Analyze Decision</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
