import React, { useMemo } from 'react';
import { OptionAnalysis, ComparisonDimension } from '../types/decision';
import { Award, RotateCcw, TrendingUp } from 'lucide-react';

interface TiebreakerScaleProps {
  options: OptionAnalysis[];
  dimensions: ComparisonDimension[];
  onResetWeights?: () => void;
}

export const TiebreakerScale: React.FC<TiebreakerScaleProps> = ({
  options,
  dimensions,
  onResetWeights,
}) => {
  const scoreResults = useMemo(() => {
    if (!options.length || !dimensions.length) return [];

    const totalWeight = dimensions.reduce((acc, dim) => acc + (dim.weight || 1), 0);

    return options.map((opt) => {
      let rawWeightedScore = 0;
      dimensions.forEach((dim) => {
        const score = dim.scores[opt.id] ?? 5;
        const weight = dim.weight ?? 1;
        rawWeightedScore += score * weight;
      });

      const normalizedScore = totalWeight > 0 ? (rawWeightedScore / totalWeight) * 10 : 0;

      return {
        option: opt,
        rawScore: rawWeightedScore,
        normalizedScore: Number(normalizedScore.toFixed(1)),
      };
    }).sort((a, b) => b.normalizedScore - a.normalizedScore);
  }, [options, dimensions]);

  if (scoreResults.length < 2) return null;

  const topOption = scoreResults[0];
  const secondOption = scoreResults[1];
  const diff = Number((topOption.normalizedScore - secondOption.normalizedScore).toFixed(1));

  const optLeft = options[0];
  const optRight = options[1];

  const leftResult = scoreResults.find((r) => r.option.id === optLeft.id);
  const rightResult = scoreResults.find((r) => r.option.id === optRight.id);

  const leftScore = leftResult ? leftResult.normalizedScore : 5;
  const rightScore = rightResult ? rightResult.normalizedScore : 5;
  const rawDiff = rightScore - leftScore;
  const tiltDegrees = Math.max(-10, Math.min(10, rawDiff * 3));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Top status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800 font-heading">
            Live Balance Scale
          </h3>
          <span className="text-xs text-slate-400">• Driven by your weights</span>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {onResetWeights && (
            <button
              onClick={onResetWeights}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition"
              title="Reset weights"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Weights
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {diff === 0 ? 'Tied Score' : `${topOption.option.name} leads (+${diff} pts)`}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Beam Graphic */}
      <div className="py-2 flex flex-col items-center">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Pivoting beam */}
          <div
            className="w-full h-2 bg-slate-300 rounded-full relative transition-transform duration-500 ease-out origin-center"
            style={{ transform: `rotate(${tiltDegrees}deg)` }}
          >
            <div className="absolute left-2 -top-2 w-3.5 h-3.5 rounded-full border-2 border-blue-600 bg-white shadow-xs" />
            <div className="absolute right-2 -top-2 w-3.5 h-3.5 rounded-full border-2 border-blue-600 bg-white shadow-xs" />
            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xs z-10" />
          </div>

          {/* Fulcrum stand */}
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-slate-400 -mt-0.5" />
          <div className="w-14 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Option score boxes */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <div
            className={`p-3 rounded-xl border text-center transition ${
              leftResult?.option.id === topOption.option.id && diff > 0
                ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              Option A
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {optLeft.name}
            </div>
            <div className="text-xl font-black text-blue-600 font-heading mt-0.5">
              {leftScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-center transition ${
              rightResult?.option.id === topOption.option.id && diff > 0
                ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              Option B
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {optRight.name}
            </div>
            <div className="text-xl font-black text-blue-600 font-heading mt-0.5">
              {rightScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
