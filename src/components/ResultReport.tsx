import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Ban, 
  HelpCircle, 
  ExternalLink, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  FileText,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { AnalysisRecord, ClassificationType } from '../types/index.ts';

interface ResultReportProps {
  analysis: AnalysisRecord;
  onReset: () => void;
}

export const ResultReport: React.FC<ResultReportProps> = ({ analysis, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showPipelineDetails, setShowPipelineDetails] = useState(false);

  const getBadgeConfig = (classification: ClassificationType) => {
    switch (classification) {
      case 'Likely Credible':
        return {
          icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
          title: 'Likely Credible',
          textClass: 'text-emerald-400',
          bgClass: 'bg-emerald-950/40 border-emerald-500/40',
          accentBorder: 'border-emerald-500/30',
          description: 'The content exhibits indicators consistent with verified journalistic practices, neutral rhetoric, and credible attribution.'
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
          title: 'Potentially Misleading',
          textClass: 'text-amber-400',
          bgClass: 'bg-amber-950/40 border-amber-500/40',
          accentBorder: 'border-amber-500/30',
          description: 'Contains selective claims, unsubstantiated insider assertions, or emotional framing that may distort context.'
        };
      case 'Likely False':
        return {
          icon: <Ban className="h-6 w-6 text-rose-400" />,
          title: 'Likely False / Fabricated',
          textClass: 'text-rose-400',
          bgClass: 'bg-rose-950/40 border-rose-500/40',
          accentBorder: 'border-rose-500/30',
          description: 'High concentration of fabricated claims, conspiracy tropes, unverified sensationalism, or debunked rumors.'
        };
      default:
        return {
          icon: <HelpCircle className="h-6 w-6 text-slate-400" />,
          title: 'Insufficient Evidence',
          textClass: 'text-slate-400',
          bgClass: 'bg-slate-900 border-slate-700',
          accentBorder: 'border-slate-700',
          description: 'The submitted excerpt is too short or lacks specific verifiable factual assertions to reach a conclusive assessment.'
        };
    }
  };

  const badge = getBadgeConfig(analysis.classification);

  const handleCopySummary = () => {
    const text = `TruthGuard Assessment:
Headline: ${analysis.headline}
Assessment: ${analysis.classification}
Confidence: ${Math.round(analysis.modelConfidence * 100)}% (${analysis.confidenceLabel})
Explanation: ${analysis.explanation}
Suspicious Phrases: ${analysis.suspiciousPhrases?.join(', ') || 'None'}
Limitations: ${analysis.limitations}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-medium text-slate-400">Analysis Reference ID</span>
          <p className="font-mono text-xs text-indigo-300 tabular-nums">{analysis._id}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Export / Print</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Primary Assessment Hero Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${badge.bgClass} backdrop-blur-sm transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {badge.icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Credibility Assessment</span>
                <span className="text-xs text-slate-500 font-mono">·</span>
                <span className="text-xs text-slate-400 font-medium">Model Confidence: {Math.round(analysis.modelConfidence * 100)}%</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${badge.textClass}`}>
                {badge.title}
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                {badge.description}
              </p>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="w-full md:w-56 p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">AI Confidence</span>
              <span className="font-mono text-slate-200 tabular-nums font-semibold">
                {Math.round(analysis.modelConfidence * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  analysis.classification === 'Likely Credible'
                    ? 'bg-emerald-500'
                    : analysis.classification === 'Potentially Misleading'
                    ? 'bg-amber-500'
                    : analysis.classification === 'Likely False'
                    ? 'bg-rose-500'
                    : 'bg-slate-500'
                }`}
                style={{ width: `${Math.round(analysis.modelConfidence * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              {analysis.confidenceLabel}
            </p>
          </div>
        </div>

        {/* Investigated Content Overview */}
        <div className="mt-6 pt-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analyzed Headline</span>
          <h3 className="text-lg font-bold text-white mt-1 leading-snug">
            "{analysis.headline}"
          </h3>
          {analysis.sourceUrl && (
            <div className="mt-2 flex items-center gap-2 text-xs text-indigo-400 truncate">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <a
                href={analysis.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline truncate"
              >
                {analysis.sourceUrl}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Ethical AI Uncertainty Notice (Mandatory Directive) */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200/90 leading-relaxed">
        <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-indigo-300">Methodological Transparency Disclosure: </strong>
          {analysis.limitations || 'Never claim that an AI prediction proves a news story is true or false. Present results as an assessment with supporting evidence, limitations, and uncertainty. Independent human verification of primary sources is strongly advised.'}
        </div>
      </div>

      {/* Grid of Explainable Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Deep Explanation & Suspicious Phrases */}
        <div className="lg:col-span-2 space-y-6">

          {/* Detailed Explanation */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explainable AI Reasoning</h4>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {analysis.explanation}
            </p>

            {/* Manipulation Techniques Chips */}
            {analysis.manipulationTechniques && analysis.manipulationTechniques.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Detected Rhetorical Patterns:</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.manipulationTechniques.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suspicious Phrases Section */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Key Suspicious Phrases & Signals
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {analysis.suspiciousPhrases?.length || 0} flagged
              </span>
            </div>

            {analysis.suspiciousPhrases && analysis.suspiciousPhrases.length > 0 ? (
              <div className="space-y-2 mt-3">
                {analysis.suspiciousPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-start gap-2"
                  >
                    <span className="text-rose-400 font-bold">"</span>
                    <span className="flex-1">{phrase}</span>
                    <span className="text-rose-400 font-bold">"</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                No high-risk sensational or deceptive phrases were isolated in this submission.
              </p>
            )}
          </div>

          {/* Extracted Key Claims */}
          {analysis.keyClaims && analysis.keyClaims.length > 0 && (
            <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Identified Factual Claims</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.keyClaims.map((claim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold font-mono">0{idx + 1}.</span>
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Column: Source Verification, NLP Metrics & Steps */}
        <div className="space-y-6">

          {/* NLP Heuristics Radar */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              NLP Linguistic Indicators
            </h4>
            <div className="space-y-4 text-xs">
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Sensationalism Intensity</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {analysis.nlpMetrics?.sensationalScore || 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${analysis.nlpMetrics?.sensationalScore || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Clickbait Propensity</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {analysis.nlpMetrics?.clickbaitScore || 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-rose-500"
                    style={{ width: `${analysis.nlpMetrics?.clickbaitScore || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Source Attribution Index</span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {analysis.nlpMetrics?.attributionScore || 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${analysis.nlpMetrics?.attributionScore || 0}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Word Count: <strong className="text-slate-300 font-mono">{analysis.nlpMetrics?.wordCount || 0}</strong></span>
                <span>Sentences: <strong className="text-slate-300 font-mono">{analysis.nlpMetrics?.sentenceCount || 0}</strong></span>
              </div>

              {analysis.nlpMetrics?.topTfidfTerms && analysis.nlpMetrics.topTfidfTerms.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1.5">Top TF-IDF Salient Terms:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.nlpMetrics.topTfidfTerms.map((t, idx) => (
                      <span key={idx} className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                        {t.term} ({t.score})
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Reputable Verification Sources & Registries */}
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Corroboration Registries
              </h4>
            </div>

            {analysis.evidenceSources && analysis.evidenceSources.length > 0 ? (
              <div className="space-y-3">
                {analysis.evidenceSources.map((source, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200 truncate">{source.sourceName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        source.credibilityTier === 'High' ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 bg-slate-800'
                      }`}>
                        {source.credibilityTier}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-1">{source.title}</p>
                    <p className="text-slate-400 text-[11px] mt-1">{source.note}</p>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline mt-2"
                      >
                        <span>Access Registry</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No external corroboration records available. Independent verification required.
              </p>
            )}
          </div>

          {/* Recommended Verification Steps */}
          {analysis.recommendedVerificationSteps && analysis.recommendedVerificationSteps.length > 0 && (
            <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Recommended Verification Steps
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.recommendedVerificationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0 font-bold">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* Expandable Model Pipeline Diagnostics */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
        <button
          onClick={() => setShowPipelineDetails(!showPipelineDetails)}
          className="w-full flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-400" />
            <span>Multi-Stage AI/ML Pipeline Diagnostics & Model Breakdown</span>
          </div>
          {showPipelineDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showPipelineDetails && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">TF-IDF Propensity</span>
              <span className="text-sm font-bold text-indigo-300 tabular-nums">
                {analysis.modelPipeline?.tfidfScore !== undefined ? (analysis.modelPipeline.tfidfScore * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Naive Bayes P(Fake)</span>
              <span className="text-sm font-bold text-indigo-300 tabular-nums">
                {analysis.modelPipeline?.naiveBayesScore !== undefined ? (analysis.modelPipeline.naiveBayesScore * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Logistic Regression</span>
              <span className="text-sm font-bold text-indigo-300 tabular-nums">
                {analysis.modelPipeline?.logisticRegressionScore !== undefined ? (analysis.modelPipeline.logisticRegressionScore * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Gemini Semantic Layer</span>
              <span className={`text-sm font-bold tabular-nums ${analysis.modelPipeline?.geminiUsed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {analysis.modelPipeline?.geminiUsed ? 'Active (Gemini 3.8 Flash)' : 'Fallback (NLP only)'}
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
