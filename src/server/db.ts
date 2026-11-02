import fs from 'fs';
import path from 'path';
import { AnalysisRecord, User, DashboardStats, ClassificationType } from '../types/index.ts';

interface DbUser extends User {
  passwordHash: string;
}

interface DbSchema {
  users: DbUser[];
  analyses: AnalysisRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'truthguard_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed benchmark analyses for immediate evaluation
const SEED_ANALYSES: AnalysisRecord[] = [
  {
    _id: 'tg-seed-001',
    headline: 'James Webb Space Telescope Identifies Oldest Galaxy Candidates to Date',
    articleText: 'Astronomers using data from the NASA/ESA/CSA James Webb Space Telescope have published peer-reviewed findings in the Astrophysical Journal identifying candidate galaxies that formed just 300 million years after the Big Bang. Spectroscopic confirmation by international research teams verified high redshift spectral markers z=14.32, according to project leads at the Space Telescope Science Institute.',
    sourceUrl: 'https://nasa.gov/mission_pages/webb/discoveries/oldest-galaxies',
    classification: 'Likely Credible',
    modelConfidence: 0.94,
    confidenceLabel: 'High model confidence',
    explanation: 'The article exhibits rigorous journalistic standards: citations of peer-reviewed literature in the Astrophysical Journal, naming verified institutional leads at STScI, precise scientific terminology without sensationalized hyperbole, and verifiable spectroscopic observational parameters.',
    suspiciousPhrases: [],
    manipulationTechniques: ['None detected: neutral, evidence-grounded attribution'],
    keyClaims: [
      'JWST detected candidate galaxies formed 300 million years post-Big Bang',
      'Findings peer-reviewed in Astrophysical Journal',
      'Spectroscopic redshift verified at z=14.32'
    ],
    evidenceSources: [
      {
        title: 'NASA JWST Mission Observations Archive',
        url: 'https://nasa.gov',
        sourceName: 'NASA / STScI',
        credibilityTier: 'High',
        note: 'Primary scientific space agency repository'
      },
      {
        title: 'Astrophysical Journal Redshift Analysis',
        url: 'https://iopscience.iop.org',
        sourceName: 'The Astrophysical Journal',
        credibilityTier: 'High',
        note: 'Peer-reviewed academic astrophysics publication'
      }
    ],
    recommendedVerificationSteps: [
      'Inspect official NASA STScI mission releases',
      'Cross-check DOI in Astrophysical Journal indexed databases'
    ],
    limitations: 'Model assessed linguistic credibility, institutional named entities, and lack of sensationalism. Independent astrophysical verification depends on continued peer spectroscopy.',
    publisherInfo: {
      name: 'NASA Science Releases',
      domain: 'nasa.gov',
      reliabilityRating: 'High Reputation',
      notes: 'Official space agency press archive'
    },
    nlpMetrics: {
      sensationalScore: 4,
      clickbaitScore: 2,
      attributionScore: 96,
      readabilityGrade: 'College Level',
      wordCount: 54,
      sentenceCount: 2,
      allCapsRatio: 0.04,
      exclamationDensity: 0.0,
      topTfidfTerms: [
        { term: 'astronomers', score: 0.42 },
        { term: 'spectroscopic', score: 0.39 },
        { term: 'peer-reviewed', score: 0.35 }
      ]
    },
    modelPipeline: {
      tfidfScore: 0.08,
      naiveBayesScore: 0.06,
      logisticRegressionScore: 0.07,
      geminiReasoningScore: 0.04,
      geminiUsed: true,
      pipelineLatencyMs: 340
    },
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString()
  },
  {
    _id: 'tg-seed-002',
    headline: 'SHOCKING SECRET: Secret cure discovered that Big Pharma is desperately trying to BAN!',
    articleText: 'Doctors are FURIOUS because this simple backyard root cleanses 100% of toxins overnight! Mainstream medicine has been hiding this miracle solution from the public for over 50 years to protect their trillion-dollar profits. Whistleblowers have leaked the hidden recipe before authorities censor it completely. Act now before this page is deleted forever!',
    sourceUrl: 'https://unknown-natural-miracles-today.xyz/secret-cure',
    classification: 'Likely False',
    modelConfidence: 0.98,
    confidenceLabel: 'Very high model confidence',
    explanation: 'Contains overwhelming markers of predatory pseudo-medical disinformation: emotional panic, conspiracy tropes ("Big Pharma hiding it"), unverified claims ("100% guaranteed toxins cleanse overnight"), artificial urgency ("before this page is deleted"), and zero identifiable medical sources or peer-reviewed clinical trials.',
    suspiciousPhrases: [
      'SHOCKING SECRET',
      '100% of toxins overnight',
      'hiding this miracle solution',
      'Whistleblowers have leaked',
      'Act now before this page is deleted forever'
    ],
    manipulationTechniques: [
      'Conspiracy Narrative (Suppression by Authorities)',
      'False Urgency & Scarcity Pressure',
      'Absolute Guarantees (100% Cure)',
      'Loaded Alarmist Language',
      'Anonymous Whistleblower Hearsay'
    ],
    keyClaims: [
      'Backyard root cures all toxins overnight with 100% efficacy',
      'Mainstream medical industry suppressed recipe for 50 years'
    ],
    evidenceSources: [
      {
        title: 'WHO Public Health Advisory on Medical Misinformation',
        url: 'https://who.int',
        sourceName: 'World Health Organization',
        credibilityTier: 'High',
        note: 'Warns against unregulated miracle cure claims and false suppression narratives'
      },
      {
        title: 'FDA Health Fraud Alert Registry',
        url: 'https://fda.gov',
        sourceName: 'US FDA',
        credibilityTier: 'High',
        note: 'Commonly flags herbal backyard cure scams'
      }
    ],
    recommendedVerificationSteps: [
      'Check FDA or EMA database for registered therapeutic clinical trials',
      'Consult licensed medical physicians before consuming unverified substances',
      'Search WHO and PubMed for any peer-reviewed toxicology reviews'
    ],
    limitations: 'Linguistic and rhetorical pattern analysis strongly correlates with commercial supplement fraud. No empirical lab testing of physical product conducted.',
    publisherInfo: {
      name: 'Unknown-Natural-Miracles',
      domain: 'unknown-natural-miracles-today.xyz',
      reliabilityRating: 'Known Disinformation',
      notes: 'Unregistered spam/affiliate marketing portal'
    },
    nlpMetrics: {
      sensationalScore: 98,
      clickbaitScore: 95,
      attributionScore: 0,
      readabilityGrade: 'Middle School',
      wordCount: 57,
      sentenceCount: 4,
      allCapsRatio: 0.16,
      exclamationDensity: 0.08,
      topTfidfTerms: [
        { term: 'miracle', score: 0.65 },
        { term: 'secret', score: 0.58 },
        { term: 'censor', score: 0.49 },
        { term: 'toxins', score: 0.44 }
      ]
    },
    modelPipeline: {
      tfidfScore: 0.94,
      naiveBayesScore: 0.96,
      logisticRegressionScore: 0.95,
      geminiReasoningScore: 0.98,
      geminiUsed: true,
      pipelineLatencyMs: 410
    },
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  },
  {
    _id: 'tg-seed-003',
    headline: 'Central Bank Announces Interest Rates Will Be Cut by 300 Basis Points Next Month',
    articleText: 'An anonymous insider familiar with central bank discussions leaked that benchmark lending rates will drop drastically by 300 basis points in the upcoming scheduled monetary committee meeting. While official spokespeople declined to verify the timeline, market speculators have already begun pricing in the unprecedented easing cycle.',
    sourceUrl: 'https://finance-rumors-blog.net/post/central-bank-cut',
    classification: 'Potentially Misleading',
    modelConfidence: 0.82,
    confidenceLabel: 'High model confidence',
    explanation: 'The article presents speculative market hearsay as an established upcoming policy. It relies entirely on an unnamed "insider familiar with discussions" while acknowledging that official central bank representatives refused to confirm the claim. A single-meeting 300 bps rate cut is historically extreme and uncorroborated by published committee minutes.',
    suspiciousPhrases: [
      'anonymous insider familiar with central bank discussions',
      'official spokespeople declined to verify',
      'unprecedented easing cycle'
    ],
    manipulationTechniques: [
      'Unattributed Insider Sourcing',
      'Definitive Headline for Speculative Rumor',
      'Clickbait Financial Sensationalism'
    ],
    keyClaims: [
      'Central bank planned a 300 basis point rate reduction for next month',
      'Anonymous source provided details without official bank confirmation'
    ],
    evidenceSources: [
      {
        title: 'Federal Reserve / ECB Monetary Policy Calendar & Releases',
        url: 'https://federalreserve.gov',
        sourceName: 'Central Banking Authority',
        credibilityTier: 'High',
        note: 'Official statements reflect scheduled deliberative consensus, not single-insider leaks'
      },
      {
        title: 'Bloomberg & Reuters Financial Fact Check Desk',
        url: 'https://reuters.com',
        sourceName: 'Reuters Fact Check',
        credibilityTier: 'High',
        note: 'Tracks monetary policy rumors vs scheduled committee statements'
      }
    ],
    recommendedVerificationSteps: [
      'Wait for official Federal Reserve / ECB monetary policy statement',
      'Check official economic calendars for committee meeting dates and consensus polls',
      'Review statements by voting board governors rather than anonymous rumors'
    ],
    limitations: 'Model assessed sourcing hygiene, institutional probability, and linguistic framing. Official policy cannot be confirmed until central bank publication.',
    publisherInfo: {
      name: 'Finance Rumors Blog',
      domain: 'finance-rumors-blog.net',
      reliabilityRating: 'Mixed / Satire',
      notes: 'Speculative blog platform with no formal editorial oversight'
    },
    nlpMetrics: {
      sensationalScore: 68,
      clickbaitScore: 74,
      attributionScore: 28,
      readabilityGrade: 'High School',
      wordCount: 46,
      sentenceCount: 2,
      allCapsRatio: 0.02,
      exclamationDensity: 0.0,
      topTfidfTerms: [
        { term: 'insider', score: 0.52 },
        { term: 'speculators', score: 0.44 },
        { term: 'rumors', score: 0.41 }
      ]
    },
    modelPipeline: {
      tfidfScore: 0.65,
      naiveBayesScore: 0.72,
      logisticRegressionScore: 0.70,
      geminiReasoningScore: 0.78,
      geminiUsed: true,
      pipelineLatencyMs: 380
    },
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
  },
  {
    _id: 'tg-seed-004',
    headline: 'Local Municipal Council Approves Park Renovation Budget for Q3',
    articleText: 'The City Council voted 7 to 2 yesterday to allocate $450,000 towards upgrading walking trails and replacing lighting in Riverside Park. Public hearings were held over three weeks, with the municipal engineering bureau outlining project milestones expected to complete by late autumn.',
    sourceUrl: 'https://riversidegazette.org/council-approves-park-renovation',
    classification: 'Likely Credible',
    modelConfidence: 0.96,
    confidenceLabel: 'Very high model confidence',
    explanation: 'Factual civic reporting featuring transparent council voting tallies (7 to 2), specific realistic financial appropriations ($450,000), reference to public municipal hearings, and a calm, objective journalistic tone devoid of hyperbole or emotional appeals.',
    suspiciousPhrases: [],
    manipulationTechniques: ['None: standard local government reporting'],
    keyClaims: [
      'City Council approved $450,000 budget with 7-2 vote for Riverside Park',
      'Renovations cover walking trails and lighting',
      'Completion slated for late autumn'
    ],
    evidenceSources: [
      {
        title: 'Municipal Council Official Minutes & Voting Records',
        url: 'https://riverside.gov/minutes',
        sourceName: 'City Council Archive',
        credibilityTier: 'High',
        note: 'Public record of council vote and fiscal resolutions'
      }
    ],
    recommendedVerificationSteps: [
      'Check city council public records portal for meeting minutes',
      'Review municipal budget balance sheet'
    ],
    limitations: 'Model evaluated local reporting conventions and balanced factual framing.',
    publisherInfo: {
      name: 'Riverside Gazette',
      domain: 'riversidegazette.org',
      reliabilityRating: 'High Reputation',
      notes: 'Local community newspaper with editorial accountability'
    },
    nlpMetrics: {
      sensationalScore: 2,
      clickbaitScore: 0,
      attributionScore: 92,
      readabilityGrade: 'Grade 9',
      wordCount: 43,
      sentenceCount: 2,
      allCapsRatio: 0.01,
      exclamationDensity: 0.0,
      topTfidfTerms: [
        { term: 'council', score: 0.55 },
        { term: 'allocate', score: 0.48 },
        { term: 'hearings', score: 0.42 }
      ]
    },
    modelPipeline: {
      tfidfScore: 0.04,
      naiveBayesScore: 0.05,
      logisticRegressionScore: 0.05,
      geminiReasoningScore: 0.03,
      geminiUsed: true,
      pipelineLatencyMs: 290
    },
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  }
];

class DatabaseService {
  private data: DbSchema = {
    users: [],
    analyses: []
  };

  constructor() {
    this.loadDatabase();
  }

  private loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || [],
          analyses: parsed.analyses && parsed.analyses.length > 0 ? parsed.analyses : SEED_ANALYSES
        };
      } else {
        this.data = {
          users: [],
          analyses: SEED_ANALYSES
        };
        this.saveDatabase();
      }
    } catch (err) {
      console.warn('Fallback to in-memory db due to read error:', err);
      this.data = {
        users: [],
        analyses: SEED_ANALYSES
      };
    }
  }

  private saveDatabase() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // User Operations (MongoDB Users collection equivalent)
  public async findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public async findUserById(id: string) {
    const user = this.data.users.find(u => u._id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public async createUser(user: { name: string; email: string; passwordHash: string; role?: string }) {
    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      name: user.name,
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash,
      role: user.role || 'user',
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  // Analyses Operations (MongoDB NewsAnalyses collection equivalent)
  public async createAnalysis(record: Omit<AnalysisRecord, '_id' | 'createdAt'>): Promise<AnalysisRecord> {
    const newRecord: AnalysisRecord = {
      ...record,
      _id: 'analysis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    this.data.analyses.unshift(newRecord);
    this.saveDatabase();
    return newRecord;
  }

  public async getAnalyses(params?: {
    userId?: string;
    search?: string;
    classification?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: AnalysisRecord[]; total: number; page: number; totalPages: number }> {
    let items = [...this.data.analyses];

    if (params?.userId) {
      // Return user items + seed items for rich view
      items = items.filter(a => !a.userId || a.userId === params.userId);
    }

    if (params?.classification && params.classification !== 'All') {
      items = items.filter(a => a.classification.toLowerCase() === params.classification!.toLowerCase());
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      items = items.filter(
        a =>
          a.headline.toLowerCase().includes(q) ||
          a.articleText.toLowerCase().includes(q) ||
          (a.explanation && a.explanation.toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 20));
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  public async getAnalysisById(id: string): Promise<AnalysisRecord | null> {
    const found = this.data.analyses.find(a => a._id === id);
    return found || null;
  }

  public async deleteAnalysis(id: string, userId?: string): Promise<boolean> {
    const initialLen = this.data.analyses.length;
    this.data.analyses = this.data.analyses.filter(a => {
      if (a._id !== id) return true;
      if (userId && a.userId && a.userId !== userId) {
        return true; // Not owned by requesting user
      }
      return false; // Delete it
    });

    const deleted = this.data.analyses.length < initialLen;
    if (deleted) {
      this.saveDatabase();
    }
    return deleted;
  }

  public async getStats(): Promise<DashboardStats> {
    const analyses = this.data.analyses;
    const total = analyses.length;

    let credible = 0;
    let misleading = 0;
    let falseNews = 0;
    let insufficient = 0;
    let totalConfidence = 0;
    let totalSensational = 0;
    let totalClickbait = 0;
    let totalAttribution = 0;

    analyses.forEach(a => {
      if (a.classification === 'Likely Credible') credible++;
      else if (a.classification === 'Potentially Misleading') misleading++;
      else if (a.classification === 'Likely False') falseNews++;
      else insufficient++;

      totalConfidence += a.modelConfidence || 0.8;
      if (a.nlpMetrics) {
        totalSensational += a.nlpMetrics.sensationalScore || 0;
        totalClickbait += a.nlpMetrics.clickbaitScore || 0;
        totalAttribution += a.nlpMetrics.attributionScore || 0;
      }
    });

    const categoryDistribution: { category: ClassificationType; count: number; percentage: number }[] = [
      {
        category: 'Likely Credible',
        count: credible,
        percentage: total > 0 ? Math.round((credible / total) * 100) : 0
      },
      {
        category: 'Potentially Misleading',
        count: misleading,
        percentage: total > 0 ? Math.round((misleading / total) * 100) : 0
      },
      {
        category: 'Likely False',
        count: falseNews,
        percentage: total > 0 ? Math.round((falseNews / total) * 100) : 0
      },
      {
        category: 'Insufficient Evidence',
        count: insufficient,
        percentage: total > 0 ? Math.round((insufficient / total) * 100) : 0
      }
    ];

    // Compute recent activity days (past 7 days activity)
    const recentActivityMap: Record<string, { credible: number; suspicious: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400 * 1000);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      recentActivityMap[key] = { credible: 0, suspicious: 0 };
    }

    analyses.forEach(a => {
      const d = new Date(a.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (recentActivityMap[key]) {
        if (a.classification === 'Likely Credible') {
          recentActivityMap[key].credible++;
        } else {
          recentActivityMap[key].suspicious++;
        }
      }
    });

    const recentActivity = Object.entries(recentActivityMap).map(([date, counts]) => ({
      date,
      credible: counts.credible,
      suspicious: counts.suspicious
    }));

    return {
      totalAnalyzed: total,
      likelyCredible: credible,
      potentiallyMisleading: misleading,
      likelyFalse: falseNews,
      insufficientEvidence: insufficient,
      averageConfidence: total > 0 ? Number((totalConfidence / total).toFixed(2)) : 0.9,
      avgSensationalism: total > 0 ? Math.round(totalSensational / total) : 35,
      avgClickbait: total > 0 ? Math.round(totalClickbait / total) : 28,
      avgAttribution: total > 0 ? Math.round(totalAttribution / total) : 62,
      categoryDistribution,
      recentActivity,
      recentAnalyses: analyses.slice(0, 5)
    };
  }

  public async seedDefaultExamples(): Promise<number> {
    let added = 0;
    for (const seed of SEED_ANALYSES) {
      if (!this.data.analyses.some(a => a._id === seed._id)) {
        this.data.analyses.push(seed);
        added++;
      }
    }
    if (added > 0) {
      this.saveDatabase();
    }
    return added;
  }
}

export const db = new DatabaseService();
