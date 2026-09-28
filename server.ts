import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { analyzeRequirement, reSynthesizeRequirementWithAnswers } from './server/analyzer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Requirement Quality Agent',
      geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
    });
  });

  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      const { text, pbiId, domainHint, context } = req.body;
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Requirement text is required' });
        return;
      }
      const result = await analyzeRequirement(text, pbiId || 'PBI-1001', domainHint, context);
      res.json(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      res.status(500).json({ error: err.message || 'Analysis failed' });
    }
  });

  app.post('/api/resolve-questions', async (req: Request, res: Response) => {
    try {
      const { originalResult, answers } = req.body;
      if (!originalResult || !answers) {
        res.status(400).json({ error: 'originalResult and answers are required' });
        return;
      }
      const result = await reSynthesizeRequirementWithAnswers(originalResult, answers);
      res.json(result);
    } catch (err: any) {
      console.error('Resolve error:', err);
      res.status(500).json({ error: err.message || 'Re-synthesis failed' });
    }
  });

  // Vite integration
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Requirement Quality Agent server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
