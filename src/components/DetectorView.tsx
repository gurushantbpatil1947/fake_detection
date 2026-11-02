import React, { useState } from 'react';
import { 
  FileText, 
  Link as LinkIcon, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AnalysisRecord } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ResultReport } from './ResultReport.tsx';

interface DetectorViewProps {
  onAnalysisComplete?: (record: AnalysisRecord) => void;
}

type InputMode = 'text' | 'url' | 'file';

const BENCHMARK_EXAMPLES = [
  {
    label: 'James Webb Galaxy Discovery (Credible)',
    type: 'Likely Credible',
    headline: 'James Webb Space Telescope Identifies Oldest Galaxy Candidates to Date',
    body: 'Astronomers using data from the NASA/ESA/CSA James Webb Space Telescope have published peer-reviewed findings in the Astrophysical Journal identifying candidate galaxies that formed just 300 million years after the Big Bang. Spectroscopic confirmation by international research teams verified high redshift spectral markers z=14.32, according to project leads at the Space Telescope Science Institute.',
    url: 'https://nasa.gov/mission_pages/webb/discoveries'
  },
  {
    label: 'Secret Big Pharma Cure (False Hoax)',
    type: 'Likely False',
    headline: 'SHOCKING SECRET: Secret cure discovered that Big Pharma is desperately trying to BAN!',
    body: 'Doctors are FURIOUS because this simple backyard root cleanses 100% of toxins overnight! Mainstream medicine has been hiding this miracle solution from the public for over 50 years to protect their trillion-dollar profits. Whistleblowers have leaked the hidden recipe before authorities censor it completely. Act now before this page is deleted forever!',
    url: 'https://unknown-natural-miracles-today.xyz'
  },
  {
    label: 'Central Bank Rate Cut Leak (Misleading)',
    type: 'Potentially Misleading',
    headline: 'Central Bank Announces Interest Rates Will Be Cut by 300 Basis Points Next Month',
    body: 'An anonymous insider familiar with central bank discussions leaked that benchmark lending rates will drop drastically by 300 basis points in the upcoming scheduled monetary committee meeting. While official spokespeople declined to verify the timeline, market speculators have already begun pricing in the unprecedented easing cycle.',
    url: 'https://finance-rumors-blog.net'
  },
  {
    label: 'Municipal Park Budget (Credible Local)',
    type: 'Likely Credible',
    headline: 'Local Municipal Council Approves Park Renovation Budget for Q3',
    body: 'The City Council voted 7 to 2 yesterday to allocate $450,000 towards upgrading walking trails and replacing lighting in Riverside Park. Public hearings were held over three weeks, with the municipal engineering bureau outlining project milestones expected to complete by late autumn.',
    url: 'https://riversidegazette.org'
  }
];

export const DetectorView: React.FC<DetectorViewProps> = ({ onAnalysisComplete }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [headline, setHeadline] = useState('');
  const [articleText, setArticleText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisRecord | null>(null);

  const handleSelectExample = (example: typeof BENCHMARK_EXAMPLES[0]) => {
    setMode('text');
    setHeadline(example.headline);
    setArticleText(example.body);
    setUrlInput(example.url);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadedFile({ name: file.name, content });
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file contents.');
    };
    reader.readAsText(file);
  };

  const runAnalysis = async () => {
    setError(null);

    if (mode === 'text' && !headline.trim() && !articleText.trim()) {
      setError('Please provide at least a news headline or article excerpt.');
      return;
    }

    if (mode === 'url' && !urlInput.trim()) {
      setError('Please enter a valid news URL.');
      return;
    }

    if (mode === 'file' && !uploadedFile?.content) {
      setError('Please upload a text file or document.');
      return;
    }

    setLoading(true);
    setPipelineStage('1/5: Cleaning and tokenizing linguistic corpus...');

    // Progress updates to showcase multi-stage AI pipeline
    const timer1 = setTimeout(() => {
      setPipelineStage('2/5: Extracting TF-IDF n-grams & calculating sensationalism...');
    }, 450);

    const timer2 = setTimeout(() => {
      setPipelineStage('3/5: Running Naive Bayes & Logistic Regression classifiers...');
    }, 850);

    const timer3 = setTimeout(() => {
      setPipelineStage('4/5: Querying Gemini 3.8 Flash for explainable fact verification...');
    }, 1300);

    const timer4 = setTimeout(() => {
      setPipelineStage('5/5: Synthesizing confidence metrics & attribution reports...');
    }, 2000);

    try {
      let response: { success: boolean; analysis: AnalysisRecord };

      if (mode === 'url') {
        response = await api.analyzeUrl(urlInput.trim());
      } else if (mode === 'file') {
        response = await api.analyzeFile(uploadedFile!.content, uploadedFile!.name);
      } else {
        response = await api.analyzeText(headline.trim(), articleText.trim(), urlInput.trim() || undefined);
      }

      if (response.success && response.analysis) {
        setResult(response.analysis);
        if (onAnalysisComplete) {
          onAnalysisComplete(response.analysis);
        }
      } else {
        throw new Error('Analysis failed to produce a valid report.');
      }
    } catch (err: any) {
      setError(err.message || 'Analysis pipeline encountered an error. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setLoading(false);
      setPipelineStage('');
    }
  };

  const handleReset = () => {
    setResult(null);
    setHeadline('');
    setArticleText('');
    setUrlInput('');
    setUploadedFile(null);
    setError(null);
  };

  if (result) {
    return <ResultReport analysis={result} onReset={handleReset} />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Intro Header */}
      <div className="text-center space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Forensic News Credibility Analysis
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Multi-stage NLP text preprocessing, TF-IDF statistical scoring, and explainable AI powered by Google Gemini to identify potentially misleading news.
        </p>
      </div>

      {/* Benchmark Presets Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span>Quick Benchmark Presets (1-Click Test Cases):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {BENCHMARK_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(ex)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-950/60 hover:text-indigo-200 hover:border-indigo-500/40 border border-slate-700/60 transition-colors cursor-pointer text-left"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Mode Selector Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        
        {/* Mode Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl w-fit border border-slate-800/80 mb-6">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Headline & Article</span>
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'url'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Web URL</span>
          </button>
          <button
            onClick={() => setMode('file')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'file'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>File Document</span>
          </button>
        </div>

        {/* Input Forms */}
        {mode === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                News Headline or Claim
              </label>
              <input
                type="text"
                placeholder="e.g. Scientists claim drinking hot water prevents all viral infections"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Complete Article Body or Story Text
              </label>
              <textarea
                rows={6}
                placeholder="Paste the full article text, quoted statements, or paragraph excerpt here..."
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Source URL (Optional reference)
              </label>
              <input
                type="url"
                placeholder="https://example.com/news-story"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        )}

        {mode === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Enter News Article URL
              </label>
              <input
                type="url"
                placeholder="https://www.reuters.com/... or https://blog.example.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-xs text-slate-400 mt-2">
                TruthGuard will fetch public text, extract title and paragraphs, and perform forensic verification.
              </p>
            </div>
          </div>
        )}

        {mode === 'file' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Upload News Text Document (.txt, .md, text excerpt)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 bg-slate-950/60 transition-colors cursor-pointer group">
                <Upload className="h-8 w-8 text-slate-500 group-hover:text-indigo-400 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                  {uploadedFile ? uploadedFile.name : 'Click to select a file or drag and drop'}
                </span>
                <span className="text-xs text-slate-500 mt-1">Plain Text or Markdown documents up to 2MB</span>
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedFile && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-medium truncate max-w-sm">
                    {uploadedFile.name}
                  </span>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Pipeline Visualizer */}
        {loading && (
          <div className="mt-6 p-5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-xs font-semibold text-indigo-300 font-mono">
                {pipelineStage || 'Running NLP pipeline...'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-pulse w-3/4 rounded-full" />
            </div>
            <p className="text-[11px] text-slate-400">
              Processing vocabulary matrices, detecting emotional hyperbole, and reasoning through factual claims...
            </p>
          </div>
        )}

        {/* Submit Action Button */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? 'Analyzing Content...' : 'Run TruthGuard Analysis'}</span>
            {!loading && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>

      </div>

      {/* Feature Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <span className="text-xs font-mono text-indigo-400 font-semibold">01. NLP Preprocessing</span>
          <h4 className="text-sm font-bold text-white">TF-IDF Vectorization</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts n-gram tokens and scores discriminative lexical weight against established misinformation and credible journalism lexicons.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <span className="text-xs font-mono text-indigo-400 font-semibold">02. Classical Classifiers</span>
          <h4 className="text-sm font-bold text-white">Bayesian & Logistic Odds</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Computes posterior likelihood of deceptive content using clickbait trigger metrics, all-caps density, and source attribution indices.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <span className="text-xs font-mono text-indigo-400 font-semibold">03. Explainable AI (XAI)</span>
          <h4 className="text-sm font-bold text-white">Gemini 3.8 Flash Reasoning</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pinpoints exact suspicious quotes, highlights manipulation techniques, and links to verified fact-checking registries with calibrated uncertainty.
          </p>
        </div>
      </div>

    </div>
  );
};
