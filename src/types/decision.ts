export type ImpactLevel = 'high' | 'medium' | 'low';

export interface ProConItem {
  id: string;
  point: string;
  impact: ImpactLevel;
  category: string;
  mitigation?: string; // For cons: how to mitigate or offset this risk
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotData;
  attributeScores: {
    attribute: string;
    score: number; // 1 to 10
    explanation: string;
  }[];
}

export interface ComparisonDimension {
  id: string;
  name: string;
  category: string;
  description: string;
  weight: number; // 1 to 5 user adjustable
  scores: Record<string, number>; // optionId -> score 1 to 10
}

export interface DecisionVerdict {
  recommendedOptionId: string;
  recommendedOptionName: string;
  confidencePercent: number;
  tiebreakerReasoning: string;
  theCruxQuestion: string; // The single decisive question to ask oneself
  decisionType: 'type1_irreversible' | 'type2_reversible';
  decisionTypeExplanation: string;
  devilsAdvocate: string;
  actionSteps: string[];
}

export interface DecisionRecord {
  id: string;
  title: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'resolved';
  chosenOptionId?: string;
  tags: string[];
  options: OptionAnalysis[];
  comparisonDimensions: ComparisonDimension[];
  verdict: DecisionVerdict;
}

export type AnalysisType = 'proscons' | 'comparison' | 'swot' | 'verdict';

export interface AnalyzeDecisionRequest {
  decision: string;
  options?: string[];
  priorities?: string[];
  context?: string;
  preferredAnalysis?: AnalysisType;
}

export type ActiveTab = 'proscons' | 'comparison' | 'swot' | 'verdict';
