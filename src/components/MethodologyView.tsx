import React from 'react';
import { 
  Cpu, 
  Brain, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  Scale, 
  AlertCircle,
  FileCode2,
  CheckCircle2
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto py-2">
      
      {/* Hero Section */}
      <div className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-8">
        <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest">
          Academic Engineering Specification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          TruthGuard AI & NLP Methodology
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Comprehensive documentation of the multi-stage text processing, mathematical vectorization, statistical classifiers, and Gemini-powered explainable AI pipeline.
        </p>
      </div>

      {/* Epistemological Stance Banner (Critical Directive) */}
      <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-700/50 space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Scale className="h-4 w-4" />
          <span>Core Epistemological Principle: Uncertainty & Assessment</span>
        </div>
        <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
          <strong>Important:</strong> TruthGuard never claims that an AI prediction proves a news story is true or false. Language models cannot act as infallible oracles of physical reality. The system presents results as an evidence-grounded forensic assessment with explicit error bounds, highlighted rhetorical patterns, and calibrated uncertainty.
        </p>
      </div>

      {/* 8-Stage Architecture Pipeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-400" />
          <span>The 8-Stage NLP & AI Analysis Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 01</span>
            <h3 className="font-bold text-white text-sm">Text Normalization & Preprocessing</h3>
            <p className="text-slate-400 leading-relaxed">
              Standardizes raw text, strips HTML artifacts, separates punctuation, and normalizes capitalization anomalies while tracking all-caps density heuristics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 02</span>
            <h3 className="font-bold text-white text-sm">Tokenization & Sentence Boundary Splitting</h3>
            <p className="text-slate-400 leading-relaxed">
              Splits input into lexical tokens and distinct sentential clauses to compute syntactic readability indices, word length distributions, and sentence counts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 03</span>
            <h3 className="font-bold text-white text-sm">Stop-Word Filtering & Morphological Analysis</h3>
            <p className="text-slate-400 leading-relaxed">
              Removes non-discriminative grammatical function tokens (prepositions, auxiliary verbs) while preserving emotionally charged modifiers and negations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 04</span>
            <h3 className="font-bold text-white text-sm">TF-IDF Feature Extraction</h3>
            <p className="text-slate-400 leading-relaxed">
              Calculates term frequency weighted by inverse document frequency across reference disinformation lexicons (e.g., conspiracy tropes, medical pseudo-panaceas).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 05</span>
            <h3 className="font-bold text-white text-sm">Naive Bayes Probabilistic Classifier</h3>
            <p className="text-slate-400 leading-relaxed">
              Computes posterior log-likelihood odds of deception given the observed distribution of salient linguistic markers under conditional independence assumptions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 06</span>
            <h3 className="font-bold text-white text-sm">Logistic Regression Log-Odds Estimation</h3>
            <p className="text-slate-400 leading-relaxed">
              Evaluates a multivariate decision boundary incorporating sensationalism scores, clickbait triggers, lack of source attribution, and typography style metrics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 07</span>
            <h3 className="font-bold text-white text-sm">Gemini 3.8 Flash Semantic Reasoning</h3>
            <p className="text-slate-400 leading-relaxed">
              Executes contextual claim extraction, identifies logical fallacies (e.g. false causality, hasty generalization), and pinpoints exact verbatim suspicious phrases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-mono text-indigo-400 font-bold">Stage 08</span>
            <h3 className="font-bold text-white text-sm">Explainable Synthesis & Registry Mapping</h3>
            <p className="text-slate-400 leading-relaxed">
              Generates calibrated credibility labels, provides actionable verification steps, and cross-references claims against verified registries (AP, Reuters, WHO).
            </p>
          </div>

        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Mathematical Formulations</h2>
        </div>

        {/* TF-IDF */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-200">1. Term Frequency-Inverse Document Frequency (TF-IDF)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Measures the relative importance of a keyword or token $t$ in a document $d$ relative to a reference corpus $D$:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-indigo-300 overflow-x-auto">
            TF(t, d) = count(t, d) / total_tokens(d)
            <br />
            IDF(t, D) = ln( (1 + |D|) / (1 + df(t, D)) ) + 1
            <br />
            TF-IDF(t, d, D) = TF(t, d) * IDF(t, D)
          </div>
        </div>

        {/* Logistic Regression */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-200">2. Logistic Regression Sigmoid Probability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Combines normalized feature vectors (sensational score $x_1$, clickbait score $x_2$, attribution index $x_3$, capitalization ratio $x_4$) using trained model weights $w$:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-indigo-300 overflow-x-auto">
            z = w_0 + (1.8 * x_sensational) + (2.2 * x_clickbait) - (2.5 * x_attribution) + (1.2 * x_allcaps)
            <br />
            P(Misleading | x) = 1 / (1 + e^(-z))
          </div>
        </div>

        {/* Naive Bayes */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-200">3. Naive Bayes Posterior Odds</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Applies Bayes' theorem with laplacian smoothing across class priors:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-indigo-300 overflow-x-auto">
            ln( P(False | T) / P(Credible | T) ) = ln( P(False)/P(Credible) ) + Σ ln( P(t_i | False) / P(t_i | Credible) )
          </div>
        </div>
      </div>

      {/* Classification Categories Reference */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-indigo-400" />
          <span>Classification Taxonomy</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="font-bold text-emerald-400 text-sm block mb-1">Likely Credible</span>
            <p className="text-slate-300">
              The article contains verifiable institutional citations, neutral journalistic tone, precise claims, and lacks deceptive clickbait or artificial urgency tactics.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <span className="font-bold text-amber-400 text-sm block mb-1">Potentially Misleading</span>
            <p className="text-slate-300">
              Presents real events with selective cherry-picking, uncorroborated single-source rumors, emotional editorializing, or exaggerated headline claims that outpace body evidence.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
            <span className="font-bold text-rose-400 text-sm block mb-1">Likely False</span>
            <p className="text-slate-300">
              High concentration of fabricated claims, conspiracy theories ("authorities are hiding this"), predatory pseudo-medical cures, or demonstrably debunked hoaxes.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-300 text-sm block mb-1">Insufficient Evidence</span>
            <p className="text-slate-400">
              Text excerpt is too brief, context-free, or vague to isolate testable factual assertions or evaluate journalistic attribution standards.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
