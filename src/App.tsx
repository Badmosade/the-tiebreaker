/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  DecisionRecord,
  AnalyzeDecisionRequest,
  ActiveTab,
  ComparisonDimension,
  ProConItem,
  AnalysisType,
} from './types/decision';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { TiebreakerScale } from './components/TiebreakerScale';
import { VerdictView } from './components/VerdictView';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { GutCheckModal } from './components/GutCheckModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import {
  Award,
  ListFilter,
  Sliders,
  Grid2X2,
  AlertCircle,
  Scale,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_decisions_v2';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionRecord | null>(null);
  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('proscons');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean UI toggles
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [showScale, setShowScale] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGutCheckOpen, setIsGutCheckOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentDecision(parsed[0]);
          setIsFormOpen(false);
        }
      }
    } catch (e) {
      console.error('Failed to load decisions from storage', e);
    }
  }, []);

  const saveHistoryToStorage = (updatedList: DecisionRecord[]) => {
    setHistory(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  // Submit new decision
  const handleAnalyzeDecision = async (req: AnalyzeDecisionRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Analysis failed with status ${res.status}`);
      }

      const newRecord: DecisionRecord = await res.json();

      setCurrentDecision(newRecord);
      setIsFormOpen(false);

      // Open the user's preferred analysis tab
      if (req.preferredAnalysis) {
        setActiveTab(req.preferredAnalysis);
      } else {
        setActiveTab('proscons');
      }

      const updatedHistory = [newRecord, ...history.filter((h) => h.id !== newRecord.id)];
      saveHistoryToStorage(updatedHistory);
    } catch (err: any) {
      console.error('Error during analysis:', err);
      setError(err.message || 'An error occurred while evaluating your decision.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDimensionWeight = (dimensionId: string, newWeight: number) => {
    if (!currentDecision) return;
    const updatedDims = currentDecision.comparisonDimensions.map((dim) =>
      dim.id === dimensionId ? { ...dim, weight: newWeight } : dim
    );
    updateActiveDecision({
      ...currentDecision,
      comparisonDimensions: updatedDims,
    });
  };

  const handleUpdateScore = (dimensionId: string, optionId: string, newScore: number) => {
    if (!currentDecision) return;
    const updatedDims = currentDecision.comparisonDimensions.map((dim) => {
      if (dim.id === dimensionId) {
        return {
          ...dim,
          scores: { ...dim.scores, [optionId]: newScore },
        };
      }
      return dim;
    });
    updateActiveDecision({
      ...currentDecision,
      comparisonDimensions: updatedDims,
    });
  };

  const handleAddDimension = (newDim: ComparisonDimension) => {
    if (!currentDecision) return;
    updateActiveDecision({
      ...currentDecision,
      comparisonDimensions: [...currentDecision.comparisonDimensions, newDim],
    });
  };

  const handleAddProCon = (optionId: string, type: 'pro' | 'con', item: ProConItem) => {
    if (!currentDecision) return;
    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          pros: type === 'pro' ? [item, ...(opt.pros || [])] : opt.pros,
          cons: type === 'con' ? [item, ...(opt.cons || [])] : opt.cons,
        };
      }
      return opt;
    });
    updateActiveDecision({
      ...currentDecision,
      options: updatedOptions,
    });
  };

  const handleDeleteProCon = (optionId: string, type: 'pro' | 'con', itemId: string) => {
    if (!currentDecision) return;
    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          pros: type === 'pro' ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
          cons: type === 'con' ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
        };
      }
      return opt;
    });
    updateActiveDecision({
      ...currentDecision,
      options: updatedOptions,
    });
  };

  const handleResetWeights = () => {
    if (!currentDecision) return;
    const updatedDims = currentDecision.comparisonDimensions.map((dim) => ({
      ...dim,
      weight: 3,
    }));
    updateActiveDecision({
      ...currentDecision,
      comparisonDimensions: updatedDims,
    });
  };

  const handleCommitDecision = (optionId: string) => {
    if (!currentDecision) return;
    updateActiveDecision({
      ...currentDecision,
      status: 'resolved',
      chosenOptionId: optionId,
    });
  };

  const handleToggleResolved = () => {
    if (!currentDecision) return;
    updateActiveDecision({
      ...currentDecision,
      status: currentDecision.status === 'resolved' ? 'pending' : 'resolved',
    });
  };

  const updateActiveDecision = (decision: DecisionRecord) => {
    setCurrentDecision(decision);
    const updatedHistory = history.map((item) => (item.id === decision.id ? decision : item));
    saveHistoryToStorage(updatedHistory);
  };

  const handleSelectDecision = (decision: DecisionRecord) => {
    setCurrentDecision(decision);
    setIsFormOpen(false);
  };

  const handleDeleteDecision = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistoryToStorage(updated);
    if (currentDecision?.id === id) {
      if (updated.length > 0) {
        setCurrentDecision(updated[0]);
      } else {
        setCurrentDecision(null);
        setIsFormOpen(true);
      }
    }
  };

  const handleClearHistory = () => {
    saveHistoryToStorage([]);
    setCurrentDecision(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        currentDecision={currentDecision}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewDecision={() => setIsFormOpen(true)}
        onOpenGutCheck={() => setIsGutCheckOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleResolved={handleToggleResolved}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <strong>Notice:</strong> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Form View */}
        {isFormOpen || !currentDecision ? (
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            onCancel={currentDecision ? () => setIsFormOpen(false) : undefined}
            hasActiveDecision={Boolean(currentDecision)}
            defaultAnalysis={activeTab}
          />
        ) : (
          <div className="space-y-5">
            {/* Dilemma Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Active Dilemma
                    </span>
                    {currentDecision.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-slate-500 px-2 py-0.5 rounded-full bg-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 font-heading">
                    {currentDecision.title}
                  </h1>
                </div>

                {/* Switcher & Scale toggle */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => setShowScale(!showScale)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    <span>{showScale ? 'Hide Scale' : 'Balance Scale'}</span>
                    {showScale ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Change Prompt</span>
                  </button>
                </div>
              </div>

              {/* Quick AI recommendation banner */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 truncate">
                  <span className="font-semibold text-blue-700">The Tiebreaker Recommends:</span>
                  <span className="font-bold text-slate-900 truncate">
                    {currentDecision.verdict.recommendedOptionName}
                  </span>
                  <span className="text-slate-400">
                    ({currentDecision.verdict.confidencePercent}% confidence)
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('verdict')}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-xs whitespace-nowrap cursor-pointer"
                >
                  View Full Verdict &rarr;
                </button>
              </div>
            </div>

            {/* Optional Collapsible Balance Scale */}
            {showScale && (
              <TiebreakerScale
                options={currentDecision.options}
                dimensions={currentDecision.comparisonDimensions}
                onResetWeights={handleResetWeights}
              />
            )}

            {/* The 3 Core Analysis Buttons (+ Verdict) */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Analysis View:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Pros & Cons List Button */}
                <button
                  onClick={() => setActiveTab('proscons')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer border ${
                    activeTab === 'proscons'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  <span>Pros & Cons</span>
                </button>

                {/* 2. Comparison Table Button */}
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer border ${
                    activeTab === 'comparison'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Comparison Table</span>
                </button>

                {/* 3. SWOT Analysis Button */}
                <button
                  onClick={() => setActiveTab('swot')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer border ${
                    activeTab === 'swot'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Grid2X2 className="w-4 h-4" />
                  <span>SWOT Analysis</span>
                </button>

                {/* 4. The Tiebreaker Verdict Button */}
                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer border ${
                    activeTab === 'verdict'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Verdict & Steps</span>
                </button>
              </div>
            </div>

            {/* Selected Analysis Render */}
            <div className="pt-1">
              {activeTab === 'proscons' && (
                <ProsConsView
                  options={currentDecision.options}
                  onAddProCon={handleAddProCon}
                  onDeleteProCon={handleDeleteProCon}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonMatrixView
                  options={currentDecision.options}
                  dimensions={currentDecision.comparisonDimensions}
                  onUpdateDimensionWeight={handleUpdateDimensionWeight}
                  onUpdateScore={handleUpdateScore}
                  onAddDimension={handleAddDimension}
                />
              )}

              {activeTab === 'swot' && (
                <SwotAnalysisView options={currentDecision.options} />
              )}

              {activeTab === 'verdict' && (
                <VerdictView
                  verdict={currentDecision.verdict}
                  options={currentDecision.options}
                  isResolved={currentDecision.status === 'resolved'}
                  chosenOptionId={currentDecision.chosenOptionId}
                  onCommitDecision={handleCommitDecision}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals & Slide-out Drawers */}
      <GutCheckModal
        isOpen={isGutCheckOpen}
        onClose={() => setIsGutCheckOpen(false)}
        options={currentDecision?.options || []}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={handleSelectDecision}
        onDeleteDecision={handleDeleteDecision}
        onClearHistory={handleClearHistory}
        activeId={currentDecision?.id}
      />

      {currentDecision && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          decision={currentDecision}
        />
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">The Tiebreaker • Decision Intelligence</span>
          <span className="text-slate-400">Powered by Google Gemini 3.8 Flash</span>
        </div>
      </footer>
    </div>
  );
}
