// aeges_integration_examples.js - Enhanced with tiered API support
import { EventEmitter } from 'events';

/**
 * Enhanced AEGES-Grok Integration with Multi-Provider Support
 * Addresses Grok3's feedback on security, scalability, and production readiness
 */

// Configuration with tiered provider support
const AI_CONFIG = {
  providers: {
    xai: {
      enabled: !!process.env.XAI_API_KEY,
      endpoint: 'https://api.x.ai/v1/chat/completions',
      model: 'grok-beta',
      maxTokens: 2048,
      rateLimit: { requests: 1000, window: 60000 }, // 1000/min
      description: 'xAI Grok 3 - Advanced reasoning and analysis'
    },
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4',
      maxTokens: 2048,
      rateLimit: { requests: 500, window: 60000 },
      description: 'OpenAI GPT-4 - Reliable analysis capabilities'
    },
    anthropic: {
      enabled: !!process.env.ANTHROPIC_API_KEY,
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2048,
      rateLimit: { requests: 300, window: 60000 },
      description: 'Anthropic Claude - Constitutional AI alignment'
    },
    mock: {
      enabled: true, // Always available for demos
      latency: { min: 200, max: 800 }, // Realistic simulation
      description: 'Demo Mode - Full-featured simulation'
    }
  },
  fallbackOrder: ['xai', 'openai', 'anthropic', 'mock'],
  consensusThreshold: 0.7 // For multi-provider analysis
};

// Enhanced rate limiting with per-provider tracking
class RateLimiter {
  constructor() {
    this.windows = new Map();
  }

  canMakeRequest(provider) {
    const config = AI_CONFIG.providers[provider];
    if (!config.rateLimit) return true;

    const now = Date.now();
    const windowKey = `${provider}_${Math.floor(now / config.rateLimit.window)}`;
    
    if (!this.windows.has(windowKey)) {
      this.windows.set(windowKey, 0);
    }

    const currentCount = this.windows.get(windowKey);
    return currentCount < config.rateLimit.requests;
  }

  recordRequest(provider) {
    const config = AI_CONFIG.providers[provider];
    if (!config.rateLimit) return;

    const now = Date.now();
    const windowKey = `${provider}_${Math.floor(now / config.rateLimit.window)}`;
    
    const currentCount = this.windows.get(windowKey) || 0;
    this.windows.set(windowKey, currentCount + 1);
  }
}

// Input validation and sanitization
class InputValidator {
  static validateTransactionData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid transaction data: must be an object');
    }

    const required = ['id', 'amount', 'timestamp', 'from', 'to'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Sanitize string inputs
    ['id', 'from', 'to'].forEach(field => {
      if (typeof data[field] === 'string') {
        data[field] = data[field].replace(/[<>\"'&]/g, '');
      }
    });

    // Validate numeric fields
    if (typeof data.amount !== 'number' || data.amount < 0) {
      throw new Error('Amount must be a positive number');
    }

    return data;
  }

  static validatePrompt(prompt) {
    if (typeof prompt !== 'string' || prompt.length === 0) {
      throw new Error('Prompt must be a non-empty string');
    }
    
    if (prompt.length > 10000) {
      throw new Error('Prompt too long: maximum 10,000 characters');
    }

    return prompt.trim();
  }
}

// Enhanced AI Provider Manager
class AIProviderManager {
  constructor() {
    this.rateLimiter = new RateLimiter();
    this.eventEmitter = new EventEmitter();
    this.activeProviders = this.getActiveProviders();
  }

  getActiveProviders() {
    return Object.entries(AI_CONFIG.providers)
      .filter(([_, config]) => config.enabled)
      .map(([name, config]) => ({ name, ...config }));
  }

  async callProvider(provider, prompt, options = {}) {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      const validatedPrompt = InputValidator.validatePrompt(prompt);
      
      if (provider === 'mock') {
        return await this.mockAnalysis(validatedPrompt, options);
      }

      // Check rate limits
      if (!this.rateLimiter.canMakeRequest(provider)) {
        throw new Error(`Rate limit exceeded for provider: ${provider}`);
      }

      const config = AI_CONFIG.providers[provider];
      const response = await this.makeAPICall(config, validatedPrompt, options);
      
      this.rateLimiter.recordRequest(provider);
      
      const duration = Date.now() - startTime;
      this.eventEmitter.emit('analysis_complete', { provider, duration, success: true });
      
      return {
        provider,
        response: response.content,
        confidence: this.calculateConfidence(response),
        duration,
        model: config.model
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      this.eventEmitter.emit('analysis_error', { provider, error: error.message, duration });
      throw error;
    }
  }

  async makeAPICall(config, prompt, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      let requestBody;
      let headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'AEGES/1.0'
      };

      // Provider-specific API formatting
      if (config.endpoint.includes('x.ai')) {
        headers['Authorization'] = `Bearer ${process.env.XAI_API_KEY}`;
        requestBody = {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: config.maxTokens,
          temperature: 0.3
        };
      } else if (config.endpoint.includes('openai')) {
        headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
        requestBody = {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: config.maxTokens,
          temperature: 0.3
        };
      } else if (config.endpoint.includes('anthropic')) {
        headers['x-api-key'] = process.env.ANTHROPIC_API_KEY;
        headers['anthropic-version'] = '2023-06-01';
        requestBody = {
          model: config.model,
          max_tokens: config.maxTokens,
          messages: [{ role: 'user', content: prompt }]
        };
      }

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract content based on provider response format
      let content;
      if (data.choices && data.choices[0]) {
        content = data.choices[0].message.content;
      } else if (data.content && data.content[0]) {
        content = data.content[0].text;
      } else {
        throw new Error('Unexpected response format');
      }

      return { content, raw: data };

    } finally {
      clearTimeout(timeoutId);
    }
  }

  async mockAnalysis(prompt, options) {
    // Simulate realistic latency
    const config = AI_CONFIG.providers.mock;
    const delay = Math.random() * (config.latency.max - config.latency.min) + config.latency.min;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Generate realistic mock response based on prompt
    const mockResponses = {
      behavioral: "Analysis shows normal transaction patterns with risk score 0.15. No suspicious behavioral indicators detected.",
      threat: "Low threat level detected. Transaction follows standard DeFi interaction patterns with no anomalous characteristics.",
      consensus: "Consensus achieved across behavioral analysis modules. Confidence: 87%"
    };

    const responseType = Object.keys(mockResponses).find(type => 
      prompt.toLowerCase().includes(type)
    ) || 'behavioral';

    return {
      content: mockResponses[responseType],
      raw: { mock: true, prompt_type: responseType }
    };
  }

  calculateConfidence(response) {
    // Simple confidence calculation based on response characteristics
    if (response.raw.mock) return 0.85; // Mock responses have standard confidence
    
    const content = response.content.toLowerCase();
    let confidence = 0.5;
    
    // Boost confidence for detailed analysis
    if (content.length > 100) confidence += 0.2;
    if (content.includes('score') || content.includes('probability')) confidence += 0.15;
    if (content.includes('confidence')) confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }
}

// Enhanced AEGES Integration Class
class GrokAEGESIntegration {
  constructor(options = {}) {
    this.aiManager = new AIProviderManager();
    this.enableConsensus = options.enableConsensus || false;
    this.primaryProvider = options.primaryProvider || AI_CONFIG.fallbackOrder[0];
    
    // Performance tracking
    this.metrics = {
      totalAnalyses: 0,
      averageLatency: 0,
      successRate: 0,
      providerUsage: {}
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.aiManager.eventEmitter.on('analysis_complete', (data) => {
      this.updateMetrics(data);
    });

    this.aiManager.eventEmitter.on('analysis_error', (data) => {
      console.warn(`Analysis failed for ${data.provider}:`, data.error);
    });
  }

  async analyzeTransactionWithAI(transactionData, options = {}) {
    try {
      // Validate transaction data
      const validatedData = InputValidator.validateTransactionData(transactionData);
      
      // Generate analysis prompt
      const prompt = this.generateAnalysisPrompt(validatedData, options);
      
      if (this.enableConsensus) {
        return await this.performConsensusAnalysis(prompt, options);
      } else {
        return await this.performSingleProviderAnalysis(prompt, options);
      }

    } catch (error) {
      console.error('Transaction analysis failed:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  generateAnalysisPrompt(transactionData, options) {
    const basePrompt = `
Analyze this transaction for behavioral anomalies and security threats:

Transaction Details:
- ID: ${transactionData.id}
- Amount: ${transactionData.amount}
- From: ${transactionData.from}
- To: ${transactionData.to}
- Timestamp: ${transactionData.timestamp}
- Network: ${transactionData.network || 'unknown'}

Context:
- Current time: ${new Date().toISOString()}
- Analysis type: ${options.analysisType || 'comprehensive'}

Please provide:
1. Risk assessment (0-1 scale)
2. Behavioral pattern analysis
3. Threat indicators
4. Recommended actions
5. Confidence level

Respond in structured format for automated processing.`;

    return basePrompt.trim();
  }

  async performSingleProviderAnalysis(prompt, options) {
    const providers = AI_CONFIG.fallbackOrder.filter(p => 
      AI_CONFIG.providers[p].enabled
    );

    for (const providerName of providers) {
      try {
        const result = await this.aiManager.callProvider(providerName, prompt, options);
        
        return {
          analysis: result.response,
          provider: result.provider,
          confidence: result.confidence,
          duration: result.duration,
          model: result.model,
          consensus: false
        };

      } catch (error) {
        console.warn(`Provider ${providerName} failed, trying next...`);
        continue;
      }
    }

    throw new Error('All AI providers failed');
  }

  async performConsensusAnalysis(prompt, options) {
    const activeProviders = this.aiManager.activeProviders.slice(0, 3); // Max 3 for consensus
    const results = [];

    // Run analyses in parallel
    const promises = activeProviders.map(async (provider) => {
      try {
        return await this.aiManager.callProvider(provider.name, prompt, options);
      } catch (error) {
        console.warn(`Consensus analysis failed for ${provider.name}:`, error);
        return null;
      }
    });

    const responses = await Promise.all(promises);
    const validResponses = responses.filter(r => r !== null);

    if (validResponses.length === 0) {
      throw new Error('No providers available for consensus analysis');
    }

    // Calculate consensus
    const consensus = this.calculateConsensus(validResponses);
    
    return {
      analysis: consensus.aggregatedAnalysis,
      providers: validResponses.map(r => r.provider),
      confidence: consensus.confidence,
      duration: Math.max(...validResponses.map(r => r.duration)),
      consensus: true,
      agreement: consensus.agreement
    };
  }

  calculateConsensus(responses) {
    // Simple consensus: average confidence and combine insights
    const totalConfidence = responses.reduce((sum, r) => sum + r.confidence, 0);
    const avgConfidence = totalConfidence / responses.length;
    
    const combinedAnalysis = responses.map((r, i) => 
      `Provider ${i + 1} (${r.provider}): ${r.response}`
    ).join('\n\n');

    return {
      aggregatedAnalysis: combinedAnalysis,
      confidence: avgConfidence,
      agreement: avgConfidence > AI_CONFIG.consensusThreshold
    };
  }

  updateMetrics(data) {
    this.metrics.totalAnalyses++;
    
    // Update average latency
    const newAvg = (this.metrics.averageLatency * (this.metrics.totalAnalyses - 1) + data.duration) / this.metrics.totalAnalyses;
    this.metrics.averageLatency = Math.round(newAvg);
    
    // Update provider usage
    if (!this.metrics.providerUsage[data.provider]) {
      this.metrics.providerUsage[data.provider] = 0;
    }
    this.metrics.providerUsage[data.provider]++;
    
    // Update success rate
    if (data.success) {
      this.metrics.successRate = this.metrics.successRate + (1 - this.metrics.successRate) / this.metrics.totalAnalyses;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      availableProviders: this.aiManager.activeProviders.map(p => ({
        name: p.name,
        description: p.description,
        enabled: true
      })),
      configuration: {
        primaryProvider: this.primaryProvider,
        consensusEnabled: this.enableConsensus,
        targetLatency: '< 800ms'
      }
    };
  }

  // Status check for deployment readiness
  async healthCheck() {
    const results = {};
    
    for (const provider of this.aiManager.activeProviders) {
      try {
        const testPrompt = "System health check - respond with OK";
        const result = await this.aiManager.callProvider(provider.name, testPrompt);
        results[provider.name] = {
          status: 'healthy',
          latency: result.duration,
          model: result.model
        };
      } catch (error) {
        results[provider.name] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    return {
      overall: Object.values(results).some(r => r.status === 'healthy') ? 'healthy' : 'unhealthy',
      providers: results,
      timestamp: new Date().toISOString()
    };
  }
}

// Multi-AI Analyzer for complex scenarios
class MultiAIAnalyzer {
  constructor() {
    this.integration = new GrokAEGESIntegration({ enableConsensus: true });
  }

  async analyzeWithMultipleProviders(transactionData, analysisTypes = ['behavioral', 'threat', 'consensus']) {
    const results = {};
    
    for (const analysisType of analysisTypes) {
      try {
        const result = await this.integration.analyzeTransactionWithAI(transactionData, { analysisType });
        results[analysisType] = result;
      } catch (error) {
        results[analysisType] = { error: error.message };
      }
    }

    return {
      transactionId: transactionData.id,
      analyses: results,
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(results)
    };
  }

  generateSummary(results) {
    const successful = Object.values(results).filter(r => !r.error);
    const avgConfidence = successful.length > 0 
      ? successful.reduce((sum, r) => sum + r.confidence, 0) / successful.length 
      : 0;

    return {
      totalAnalyses: Object.keys(results).length,
      successfulAnalyses: successful.length,
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      recommendedAction: avgConfidence > 0.8 ? 'proceed' : 'review'
    };
  }
}

// Export classes for use
export { 
  GrokAEGESIntegration, 
  MultiAIAnalyzer, 
  AIProviderManager,
  AI_CONFIG 
};

// Example usage demonstration
async function demonstrateIntegration() {
  console.log('🚀 AEGES Enhanced Integration Demo');
  console.log('=====================================');
  
  const integration = new GrokAEGESIntegration({ 
    enableConsensus: false,
    primaryProvider: 'xai' 
  });

  // Health check
  console.log('\n🔍 Performing health check...');
  const health = await integration.healthCheck();
  console.log('Health Status:', health);

  // Sample transaction analysis
  const sampleTransaction = {
    id: 'tx_demo_123',
    amount: 1000,
    from: '0x1234567890abcdef',
    to: '0xfedcba0987654321',
    timestamp: Date.now(),
    network: 'ethereum'
  };

  console.log('\n🔬 Analyzing sample transaction...');
  try {
    const result = await integration.analyzeTransactionWithAI(sampleTransaction);
    console.log('Analysis Result:', result);
  } catch (error) {
    console.error('Analysis failed:', error.message);
  }

  // Show metrics
  console.log('\n📊 Integration metrics:');
  console.log(integration.getMetrics());
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateIntegration().catch(console.error);
}