import React, { useState } from 'react';
import { OptionAnalysis, ComparisonDimension } from '../types/decision';
import { Sliders, Plus, Trophy, Sparkles } from 'lucide-react';

interface ComparisonMatrixViewProps {
  options: OptionAnalysis[];
  dimensions: ComparisonDimension[];
  onUpdateDimensionWeight: (dimensionId: string, newWeight: number) => void;
  onUpdateScore: (dimensionId: string, optionId: string, newScore: number) => void;
  onAddDimension: (dimension: ComparisonDimension) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  options,
  dimensions,
  onUpdateDimensionWeight,
  onUpdateScore,
  onAddDimension,
}) => {
  const [isAddingDimension, setIsAddingDimension] = useState(false);
  const [newDimName, setNewDimName] = useState('');
  const [newDimCategory, setNewDimCategory] = useState('Personal');
  const [newDimWeight, setNewDimWeight] = useState(3);
  const [newDimDesc, setNewDimDesc] = useState('');

  // Calculate weighted totals
  const totalWeight = dimensions.reduce((acc, dim) => acc + (dim.weight || 1), 0);

  const optionTotals = options.map((opt) => {
    let rawWeightedScore = 0;
    dimensions.forEach((dim) => {
      const score = dim.scores[opt.id] ?? 5;
      const weight = dim.weight ?? 1;
      rawWeightedScore += score * weight;
    });

    const normalized100 = totalWeight > 0 ? (rawWeightedScore / totalWeight) * 10 : 0;

    return {
      id: opt.id,
      name: opt.name,
      rawWeightedScore,
      score100: Number(normalized100.toFixed(1)),
    };
  });

  const highestScore = Math.max(...optionTotals.map((t) => t.score100));

  const handleCreateDimension = () => {
    if (!newDimName.trim()) return;

    const initialScores: Record<string, number> = {};
    options.forEach((opt) => {
      initialScores[opt.id] = 5;
    });

    const newDim: ComparisonDimension = {
      id: 'custom_dim_' + Date.now().toString(36),
      name: newDimName.trim(),
      category: newDimCategory.trim() || 'General',
      description: newDimDesc.trim() || 'Custom criteria',
      weight: newDimWeight,
      scores: initialScores,
    };

    onAddDimension(newDim);
    setNewDimName('');
    setNewDimDesc('');
    setIsAddingDimension(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <Sliders className="w-4 h-4 text-blue-600" /> Comparison Matrix & Scoring
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust importance weights (1 to 5) to reflect your priorities. Scores update in real time.
          </p>
        </div>

        <button
          onClick={() => setIsAddingDimension(!isAddingDimension)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600" />
          <span>Add Custom Dimension</span>
        </button>
      </div>

      {/* Add Custom Dimension Modal/Card */}
      {isAddingDimension && (
        <div className="bg-white border border-blue-300 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Add Evaluation Dimension
            </h4>
            <button
              onClick={() => setIsAddingDimension(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dimension Name
              </label>
              <input
                type="text"
                value={newDimName}
                onChange={(e) => setNewDimName(e.target.value)}
                placeholder="e.g. Commute Time, Growth Upside, Team Culture"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Importance Weight (1 to 5)
              </label>
              <select
                value={newDimWeight}
                onChange={(e) => setNewDimWeight(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs"
              >
                <option value={5}>5 - Crucial Priority</option>
                <option value={4}>4 - High Importance</option>
                <option value={3}>3 - Moderate Importance</option>
                <option value={2}>2 - Low Importance</option>
                <option value={1}>1 - Minor Factor</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={newDimDesc}
              onChange={(e) => setNewDimDesc(e.target.value)}
              placeholder="e.g. How this affects daily peace of mind"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingDimension(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateDimension}
              disabled={!newDimName.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
            >
              Save Dimension
            </button>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="py-3 px-4 font-bold text-slate-700 w-1/3 min-w-[180px]">
                Dimension
              </th>
              <th className="py-3 px-4 font-bold text-slate-700 w-32 min-w-[120px]">
                Weight (1-5)
              </th>
              {options.map((opt) => (
                <th
                  key={opt.id}
                  className="py-3 px-4 font-bold text-slate-900 min-w-[140px] text-center"
                >
                  <div className="font-heading text-sm">{opt.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal truncate max-w-[150px] mx-auto">
                    {opt.tagline}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {dimensions.map((dim) => {
              const scoresInRow = options.map((opt) => dim.scores[opt.id] ?? 5);
              const maxRowScore = Math.max(...scoresInRow);

              return (
                <tr key={dim.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{dim.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {dim.category}
                      </span>
                    </div>
                    {dim.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {dim.description}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={dim.weight}
                        onChange={(e) =>
                          onUpdateDimensionWeight(dim.id, Number(e.target.value))
                        }
                        className="w-16 accent-blue-600 cursor-pointer"
                        title={`Weight: ${dim.weight} of 5`}
                      />
                      <span className="w-5 text-center font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 text-[11px]">
                        {dim.weight}x
                      </span>
                    </div>
                  </td>

                  {options.map((opt) => {
                    const score = dim.scores[opt.id] ?? 5;
                    const isWinner = score === maxRowScore && scoresInRow.some((s) => s !== score);

                    return (
                      <td key={opt.id} className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={score}
                            onChange={(e) => {
                              const val = Math.max(1, Math.min(10, Number(e.target.value) || 1));
                              onUpdateScore(dim.id, opt.id, val);
                            }}
                            className={`w-12 text-center py-1 rounded font-bold transition ${
                              isWinner
                                ? 'bg-blue-50 text-blue-700 border border-blue-300 ring-1 ring-blue-500/20'
                                : 'bg-slate-50 border border-slate-200 text-slate-800'
                            }`}
                          />
                          <span className="text-[11px] text-slate-400">/10</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                <div className="flex items-center gap-1.5 font-heading">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span>Weighted Total Score</span>
                </div>
                <div className="text-[11px] text-slate-500 font-normal">
                  Weighted sum normalized out of 100
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-500 font-medium text-xs">
                {totalWeight} total weight
              </td>
              {optionTotals.map((tot) => {
                const isLeading = tot.score100 === highestScore;

                return (
                  <td key={tot.id} className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`text-xl font-extrabold font-heading ${
                          isLeading ? 'text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        {tot.score100}
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </div>
                      {isLeading && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full mt-0.5">
                          Top Scorer
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
