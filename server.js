// AEGES Production Server - Enhanced for Enterprise Deployment
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { GrokAEGESIntegration, MultiAIAnalyzer } from './integration-kits/grok3/aeges_enhanced_integration.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: NODE_ENV === 'production'
}));

app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['https://aeges.org', 'https://dashboard.aeges.org']
    : ['http://localhost:3000', 'http://localhost:3001']
}));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyBitsPerSecond: 10,
  points: NODE_ENV === 'production' ? 100 : 1000, // Requests per window
  duration: 60, // Per 60 seconds
});

const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      resetTime: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
};

app.use(express.json({ limit: '10mb' }));
app.use(rateLimitMiddleware);

// Initialize AEGES Integration
const aegisIntegration = new GrokAEGESIntegration({
  enableConsensus: NODE_ENV === 'production',
  primaryProvider: 'xai'
});

const multiAIAnalyzer = new MultiAIAnalyzer();

// Health Check Endpoints
app.get('/api/health', async (req, res) => {
  try {
    const health = await aegisIntegration.healthCheck();
    const metrics = aegisIntegration.getMetrics();
    
    res.json({
      status: health.overall,
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: '1.2.0',
      uptime: process.uptime(),
      providers: health.providers,
      metrics: {
        totalAnalyses: metrics.totalAnalyses,
        averageLatency: `${metrics.averageLatency}ms`,
        successRate: `${(metrics.successRate * 100).toFixed(1)}%`
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health/detailed', async (req, res) => {
  try {
    const health = await aegisIntegration.healthCheck();
    const metrics = aegisIntegration.getMetrics();
    
    res.json({
      overall: health.overall,
      timestamp: health.timestamp,
      services: {
        aeges: health.overall,
        database: 'healthy', // Add actual DB check
        cache: 'healthy'     // Add actual cache check
      },
      providers: health.providers,
      configuration: metrics.configuration,
      performance: {
        totalAnalyses: metrics.totalAnalyses,
        averageLatency: metrics.averageLatency,
        successRate: metrics.successRate,
        providerUsage: metrics.providerUsage
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    });
  } catch (error) {
    res.status(503).json({
      overall: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// AEGES Analysis Endpoints
app.post('/api/analyze', async (req, res) => {
  try {
    const { transactionData, options = {} } = req.body;
    
    if (!transactionData) {
      return res.status(400).json({
        error: 'Missing transactionData in request body'
      });
    }

    const analysis = await aegisIntegration.analyzeTransactionWithAI(transactionData, options);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/analyze/multi', async (req, res) => {
  try {
    const { transactionData, analysisTypes = ['behavioral', 'threat', 'consensus'] } = req.body;
    
    if (!transactionData) {
      return res.status(400).json({
        error: 'Missing transactionData in request body'
      });
    }

    const analysis = await multiAIAnalyzer.analyzeWithMultipleProviders(transactionData, analysisTypes);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Multi-analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Demo endpoint
app.get('/api/demo', (req, res) => {
  const sampleTransaction = {
    id: `demo_${Date.now()}`,
    amount: Math.floor(Math.random() * 100000),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xfedcba0987654321fedcba0987654321fedcba09',
    timestamp: Date.now(),
    network: 'ethereum'
  };

  res.json({
    message: 'AEGES Demo Transaction - Ready for Analysis',
    sampleTransaction,
    instructions: {
      analyze: 'POST /api/analyze with this transaction data',
      multiAnalyze: 'POST /api/analyze/multi for comprehensive analysis',
      health: 'GET /api/health for system status'
    },
    quickStart: {
      curl: `curl -X POST http://localhost:${PORT}/api/analyze -H "Content-Type: application/json" -d '{"transactionData": ${JSON.stringify(sampleTransaction)}}'`
    }
  });
});

// Helper function to determine deployment mode
function determineDeploymentMode() {
  const hasXAI = !!process.env.XAI_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY; 
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  
  if (hasXAI || hasOpenAI || hasAnthropic) {
    return NODE_ENV === 'production' ? 'production' : 'development';
  }
  return 'demo';
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/health/detailed', 
      'POST /api/analyze',
      'POST /api/analyze/multi',
      'GET /api/demo'
    ],
    documentation: 'https://docs.aeges.org'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  const mode = determineDeploymentMode();
  const metrics = aegisIntegration.getMetrics();
  
  console.log(`
🛡️  AEGES Server Started Successfully!
================================
🚀 Environment: ${NODE_ENV}
📍 URL: http://localhost:${PORT}
🔧 Mode: ${mode}
🤖 Providers: ${metrics.availableProviders.length} available
⚡ Health: GET /api/health
📊 Demo: GET /api/demo

${mode === 'demo' ? `
🆓 Demo Mode Active
- Full simulation with realistic responses
- Add API keys for live integration:
  export XAI_API_KEY=xai-your-key-here
  export OPENAI_API_KEY=sk-your-key-here
` : `
🔥 Live AI Integration Active!
- Providers: ${metrics.availableProviders.map(p => p.name).join(', ')}
- Ready for production analysis
`}
================================
  `);
});
