import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: Boolean(apiKey) });
});

// Decision analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { decision, options: userOptions, priorities, context } = req.body;

    if (!decision || typeof decision !== 'string' || !decision.trim()) {
      return res.status(400).json({ error: 'Please provide a decision prompt.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure it is set in your environment.',
      });
    }

    const optionsPrompt = Array.isArray(userOptions) && userOptions.filter(Boolean).length > 0
      ? `The user is considering these specific options: ${userOptions.filter(Boolean).join(', ')}.`
      : `Identify 2 to 3 distinct, realistic, and mutually exclusive options or pathways that best frame this decision dilemma.`;

    const prioritiesPrompt = Array.isArray(priorities) && priorities.filter(Boolean).length > 0
      ? `Key priorities/criteria to evaluate against: ${priorities.filter(Boolean).join(', ')}.`
      : `Identify 4 to 6 core evaluation dimensions relevant to this type of decision (e.g., Financial, Growth, Well-being, Effort, Flexibility, Risk).`;

    const contextPrompt = context && typeof context === 'string' && context.trim()
      ? `User's personal context and constraints: "${context.trim()}".`
      : ``;

    const systemPrompt = `You are "The Tiebreaker", an elite decision scientist and strategic executive advisor.
Your job is to objectively dismantle decision paralysis and deliver deep, actionable decision intelligence.
Analyze the user's dilemma with rigor, nuance, and intellectual honesty.

For every option:
- Provide 3-5 punchy, realistic Pros with impact ('high', 'medium', or 'low') and thematic category.
- Provide 3-5 distinct Cons with impact ('high', 'medium', or 'low') and an actionable 'mitigation' strategy for each con (how the user can de-risk or offset it).
- Provide a rigorous SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis with 2-4 items per quadrant.
- Provide scores (1-10) across key evaluation dimensions.

For Comparison Dimensions:
- 4-6 balanced dimensions (e.g. Risk, Financial Impact, Long-term Growth, Daily Happiness/Effort, Adaptability, Reversibility).
- Default weights (1 to 5) reflecting relative importance.
- Clear numeric scores 1 to 10 for each option on each dimension.

For The Tiebreaker Verdict:
- Identify the single recommended option based on expected value and risk asymmetry.
- Calculate a realistic confidence score (55% to 92%).
- Write a sharp, decisive synthesis ("Tiebreaker Reasoning") explaining why this option edges out the other.
- The "Crux Question": The single diagnostic question the user can ask their gut/conscience that resolves this dilemma instantly.
- Type 1 vs Type 2 Analysis: Classify whether this decision is Type 1 (irreversible, high stakes, two-way door closed) or Type 2 (reversible, experimental, low downside). Explain why and how to test it.
- Devil's Advocate: A sobering perspective on the blind spot of the recommended choice.
- 3 clear, pragmatic immediate next steps.`;

    const prompt = `Decision Dilemma: "${decision.trim()}"
${optionsPrompt}
${prioritiesPrompt}
${contextPrompt}

Respond strictly with valid JSON conforming to the requested schema.`;

    const modelConfig = {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Refined concise title of the decision' },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-4 category tags e.g. Career, Finance, Lifestyle, Tech',
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'unique snake_case id e.g. option_a' },
                name: { type: Type.STRING, description: 'Clear short name of the option' },
                tagline: { type: Type.STRING, description: 'Snappy one-sentence essence' },
                description: { type: Type.STRING, description: '2-3 sentence overview of what choosing this means' },
                pros: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      point: { type: Type.STRING },
                      impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                      category: { type: Type.STRING },
                    },
                    required: ['id', 'point', 'impact', 'category'],
                  },
                },
                cons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      point: { type: Type.STRING },
                      impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                      category: { type: Type.STRING },
                      mitigation: { type: Type.STRING, description: 'How to neutralize or offset this risk' },
                    },
                    required: ['id', 'point', 'impact', 'category', 'mitigation'],
                  },
                },
                swot: {
                  type: Type.OBJECT,
                  properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                },
                attributeScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      attribute: { type: Type.STRING },
                      score: { type: Type.NUMBER, description: '1 to 10' },
                      explanation: { type: Type.STRING },
                    },
                    required: ['attribute', 'score', 'explanation'],
                  },
                },
              },
              required: ['id', 'name', 'tagline', 'description', 'pros', 'cons', 'swot'],
            },
          },
          comparisonDimensions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                weight: { type: Type.INTEGER, description: 'Default importance from 1 to 5' },
                scores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionId: { type: Type.STRING },
                      score: { type: Type.NUMBER, description: '1 to 10' },
                    },
                    required: ['optionId', 'score'],
                  },
                },
              },
              required: ['id', 'name', 'category', 'description', 'weight', 'scores'],
            },
          },
          verdict: {
            type: Type.OBJECT,
            properties: {
              recommendedOptionId: { type: Type.STRING },
              recommendedOptionName: { type: Type.STRING },
              confidencePercent: { type: Type.INTEGER, description: 'Confidence between 50 and 95' },
              tiebreakerReasoning: { type: Type.STRING, description: 'Compelling explanation of why this choice wins' },
              theCruxQuestion: { type: Type.STRING, description: 'The single decisive litmus test question' },
              decisionType: { type: Type.STRING, enum: ['type1_irreversible', 'type2_reversible'] },
              decisionTypeExplanation: { type: Type.STRING, description: 'Why this is Type 1 or Type 2 and how to navigate it' },
              devilsAdvocate: { type: Type.STRING, description: 'The counter-argument and hidden pitfall' },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 clear immediate steps to take',
              },
            },
            required: [
              'recommendedOptionId',
              'recommendedOptionName',
              'confidencePercent',
              'tiebreakerReasoning',
              'theCruxQuestion',
              'decisionType',
              'decisionTypeExplanation',
              'devilsAdvocate',
              'actionSteps',
            ],
          },
        },
        required: ['title', 'tags', 'options', 'comparisonDimensions', 'verdict'],
      },
    };

    let responseText = '';
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: modelConfig,
        });
        if (res.text) {
          responseText = res.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} attempt failed:`, err?.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('No response generated by the AI model. Please try again.');
    }

    const rawParsed = JSON.parse(responseText);

    // Normalize comparison dimensions scores array into key-value map for quick client-side lookup
    const formattedDimensions = (rawParsed.comparisonDimensions || []).map((dim: any, idx: number) => {
      const scoreMap: Record<string, number> = {};
      if (Array.isArray(dim.scores)) {
        for (const item of dim.scores) {
          if (item && item.optionId) {
            scoreMap[item.optionId] = Number(item.score) || 5;
          }
        }
      } else if (typeof dim.scores === 'object' && dim.scores !== null) {
        Object.assign(scoreMap, dim.scores);
      }

      // Ensure every option has a score
      for (const opt of rawParsed.options || []) {
        if (scoreMap[opt.id] === undefined) {
          scoreMap[opt.id] = 6;
        }
      }

      return {
        id: dim.id || `dim_${idx}`,
        name: dim.name || 'Dimension',
        category: dim.category || 'General',
        description: dim.description || '',
        weight: typeof dim.weight === 'number' ? Math.max(1, Math.min(5, dim.weight)) : 3,
        scores: scoreMap,
      };
    });

    const decisionRecord = {
      id: 'dec_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      title: rawParsed.title || decision,
      context: context || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      tags: Array.isArray(rawParsed.tags) ? rawParsed.tags : ['General'],
      options: rawParsed.options || [],
      comparisonDimensions: formattedDimensions,
      verdict: rawParsed.verdict,
    };

    return res.json(decisionRecord);
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

// Quick ideas / presets endpoint
app.get('/api/presets', (req: Request, res: Response) => {
  res.json([
    {
      title: 'Startup Offer vs Stable Big Tech',
      decision: 'Should I leave my secure senior role at a Fortune 500 company to join a Series-A AI startup as Lead Engineer?',
      options: ['Accept Startup Lead Role', 'Stay at Corporate Senior Role'],
      priorities: ['Upside & Wealth Creation', 'Work-Life Balance', 'Career Growth', 'Financial Security'],
      context: 'I have 6 months of runway saved, a mortgage, and a high desire to learn quickly but don’t want 80-hour workweeks.',
    },
    {
      title: 'Buy a Home vs Continue Renting & Investing',
      decision: 'Should I buy a 3-bedroom suburban townhouse or continue renting in the city center while investing the down payment into index funds?',
      options: ['Buy Suburban Townhouse', 'Rent in City & Invest Difference'],
      priorities: ['Financial ROI (10 yr)', 'Lifestyle Freedom & Commute', 'Maintenance Burden', 'Space & Stability'],
      context: 'Current interest rates are ~6.5%, home prices are near peak, planning to stay in the metro area for at least 5 years.',
    },
    {
      title: 'Full Rewrite vs Incremental Refactor',
      decision: 'Should our engineering team completely rewrite our 5-year-old legacy codebase from scratch with modern architecture or incrementally refactor it?',
      options: ['Full Green-field Rewrite', 'Modular Incremental Refactor'],
      priorities: ['Time to Deliver New Features', 'System Reliability', 'Team Morale & Velocity', 'Risk of Business Disruption'],
      context: 'Technical debt is slowing down sprint velocity by ~40%, but customers rely on 99.9% uptime 24/7.',
    },
    {
      title: 'Relocate to New City vs Stay Put',
      decision: 'Should I relocate to Austin for a vibrant tech scene and lower taxes, or stay in Seattle where I have established social roots?',
      options: ['Relocate to Austin', 'Remain in Seattle'],
      priorities: ['Social Connection & Community', 'Cost of Living & Taxes', 'Professional Network', 'Quality of Life & Climate'],
      context: 'Work is remote-friendly, but local friends in Seattle are starting to disperse; seeking fresh energy and warmer weather.',
    },
  ]);
});

// Production / Dev handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`The Tiebreaker server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
