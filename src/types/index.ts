export type ClassificationType = 
  | 'Likely Credible'
  | 'Potentially Misleading'
  | 'Likely False'
  | 'Insufficient Evidence';

export interface EvidenceSource {
  title: string;
  url?: string;
  sourceName: string;
  credibilityTier: 'High' | 'Medium' | 'Unverified';
  note: string;
}

export interface NlpMetrics {
  sensationalScore: number; // 0 - 100
  clickbaitScore: number; // 0 - 100
  attributionScore: number; // 0 - 100
  readabilityGrade?: string;
  wordCount: number;
  sentenceCount: number;
  allCapsRatio: number;
  exclamationDensity: number;
  topTfidfTerms: Array<{ term: string; score: number }>;
}

export interface ModelPipelineMetrics {
  tfidfScore: number; // 0 - 1 (fake propensity)
  naiveBayesScore: number; // 0 - 1
  logisticRegressionScore: number; // 0 - 1
  geminiReasoningScore?: number; // 0 - 1
  geminiUsed: boolean;
  pipelineLatencyMs: number;
}

export interface PublisherInfo {
  name?: string;
  domain?: string;
  reliabilityRating?: 'High Reputation' | 'Mixed / Satire' | 'Known Disinformation' | 'Unknown Publisher';
  notes?: string;
}

export interface AnalysisRecord {
  _id: string;
  userId?: string;
  headline: string;
  articleText: string;
  sourceUrl?: string;
  classification: ClassificationType;
  modelConfidence: number; // 0.0 - 1.0
  confidenceLabel: string;
  explanation: string;
  suspiciousPhrases: string[];
  manipulationTechniques?: string[];
  keyClaims?: string[];
  evidenceSources: EvidenceSource[];
  recommendedVerificationSteps?: string[];
  limitations: string;
  publisherInfo?: PublisherInfo;
  nlpMetrics?: NlpMetrics;
  modelPipeline?: ModelPipelineMetrics;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  likelyCredible: number;
  potentiallyMisleading: number;
  likelyFalse: number;
  insufficientEvidence: number;
  averageConfidence: number;
  avgSensationalism: number;
  avgClickbait: number;
  avgAttribution: number;
  categoryDistribution: {
    category: ClassificationType;
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    credible: number;
    suspicious: number;
  }[];
  recentAnalyses: AnalysisRecord[];
}
