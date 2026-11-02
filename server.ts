import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';
import { nlpEngine } from './src/server/nlp-engine.ts';
import { authMiddleware, generateToken, hashPassword, verifyPassword, AuthenticatedRequest } from './src/server/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(authMiddleware);

// --- AUTHENTICATION ROUTES ---

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.createUser({ name, email, passwordHash });
    const token = generateToken({ _id: user._id, email: user.email, name: user.name });

    return res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: 'Failed to register account' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const userWithHash = await db.findUserByEmail(email);
    if (!userWithHash) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isValid = await verifyPassword(password, userWithHash.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const safeUser: { _id: string; name: string; email: string; role?: string; createdAt: string } = {
      _id: userWithHash._id,
      name: userWithHash.name,
      email: userWithHash.email,
      role: userWithHash.role,
      createdAt: userWithHash.createdAt
    };
    const token = generateToken({ _id: safeUser._id, email: safeUser.email, name: safeUser.name });

    return res.json({
      success: true,
      user: safeUser,
      token
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal login error' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  const user = await db.findUserById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  return res.json({ success: true, user });
});

// --- NEWS ANALYSIS ROUTES ---

// POST /api/news/analyze
app.post('/api/news/analyze', async (req: AuthenticatedRequest, res) => {
  try {
    const { headline, articleText, sourceUrl } = req.body;
    if (!headline && !articleText) {
      return res.status(400).json({ success: false, error: 'Headline or article text is required' });
    }

    const analysisResult = await nlpEngine.analyzeNews(headline || '', articleText || '', sourceUrl);
    const savedRecord = await db.createAnalysis({
      ...analysisResult,
      userId: req.user?._id
    });

    return res.json({
      success: true,
      analysis: savedRecord
    });
  } catch (err: any) {
    console.error('Analysis error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Analysis pipeline failed' });
  }
});

// POST /api/news/analyze-url
app.post('/api/news/analyze-url', async (req: AuthenticatedRequest, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid URL is required' });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Malformed URL provided' });
    }

    let headline = '';
    let extractedText = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'TruthGuard-FactChecker/1.0 (Mozilla/5.0 compatible)'
        }
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const html = await resp.text();
        // Simple HTML title extraction
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        headline = titleMatch ? titleMatch[1].trim() : '';

        // Strip scripts and styles
        const cleanedHtml = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');

        // Extract paragraphs
        const paragraphs: string[] = [];
        const pRegex = /<p[^>]*>([^<]+)<\/p>/gi;
        let pMatch;
        while ((pMatch = pRegex.exec(cleanedHtml)) !== null) {
          const text = pMatch[1].replace(/&[a-z]+;/gi, ' ').trim();
          if (text.length > 30) paragraphs.push(text);
          if (paragraphs.length >= 10) break;
        }

        extractedText = paragraphs.join('\n\n');
      }
    } catch (fetchErr) {
      console.warn('URL scraping fallback:', fetchErr);
    }

    if (!extractedText) {
      extractedText = `Extracted from URL: ${url}\nDomain: ${parsedUrl.hostname}\nPath: ${parsedUrl.pathname}`;
      headline = headline || `News Story from ${parsedUrl.hostname}`;
    }

    const analysisResult = await nlpEngine.analyzeNews(headline, extractedText, url);
    const savedRecord = await db.createAnalysis({
      ...analysisResult,
      userId: req.user?._id
    });

    return res.json({
      success: true,
      analysis: savedRecord,
      extractedMeta: {
        headline,
        domain: parsedUrl.hostname
      }
    });
  } catch (err: any) {
    console.error('URL analysis error:', err);
    return res.status(500).json({ success: false, error: 'Could not fetch or analyze URL' });
  }
});

// POST /api/news/analyze-file
app.post('/api/news/analyze-file', async (req: AuthenticatedRequest, res) => {
  try {
    const { fileContent, fileName } = req.body;
    if (!fileContent) {
      return res.status(400).json({ success: false, error: 'File content is required' });
    }

    // Treat first line or filename as headline if short
    const lines = fileContent.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
    const headline = lines.length > 0 && lines[0].length < 150 ? lines[0] : (fileName || 'Uploaded Document Analysis');
    const articleText = lines.slice(lines.length > 0 && lines[0].length < 150 ? 1 : 0).join('\n\n') || fileContent;

    const analysisResult = await nlpEngine.analyzeNews(headline, articleText);
    const savedRecord = await db.createAnalysis({
      ...analysisResult,
      userId: req.user?._id
    });

    return res.json({
      success: true,
      analysis: savedRecord
    });
  } catch (err: any) {
    console.error('File analysis error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process file' });
  }
});

// GET /api/news/history
app.get('/api/news/history', async (req: AuthenticatedRequest, res) => {
  try {
    const search = req.query.search as string | undefined;
    const classification = req.query.classification as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await db.getAnalyses({
      userId: req.user?._id,
      search,
      classification,
      page,
      limit
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    console.error('Get history error:', err);
    return res.status(500).json({ success: false, error: 'Could not retrieve analysis history' });
  }
});

// GET /api/news/:id
app.get('/api/news/:id', async (req, res) => {
  try {
    const record = await db.getAnalysisById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Analysis record not found' });
    }
    return res.json({ success: true, analysis: record });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve analysis' });
  }
});

// DELETE /api/news/:id
app.delete('/api/news/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const deleted = await db.deleteAnalysis(req.params.id, req.user?._id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Record not found or unauthorized' });
    }
    return res.json({ success: true, message: 'Analysis record removed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to delete record' });
  }
});

// GET /api/dashboard/stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    return res.json({ success: true, stats });
  } catch (err: any) {
    console.error('Stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve statistics' });
  }
});

// POST /api/news/seed-examples
app.post('/api/news/seed-examples', async (req, res) => {
  try {
    const count = await db.seedDefaultExamples();
    return res.json({ success: true, addedCount: count });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to seed examples' });
  }
});

// --- VITE DEV / PRODUCTION MIDDLEWARE ---

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`TruthGuard server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start TruthGuard server:', err);
});
