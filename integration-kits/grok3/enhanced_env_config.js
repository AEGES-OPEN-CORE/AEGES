// env.js - Enhanced environment configuration with security and community support
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Enhanced Environment Configuration for AEGES/QSAFP Integration
 * Supports multiple deployment scenarios while maintaining security
 */

class ConfigurationManager {
  constructor() {
    this.config = {};
    this.loadConfiguration();
    this.validateConfiguration();
  }

  loadConfiguration() {
    // Load from multiple sources in priority order
    this.loadFromEnvironment();
    this.loadFromFiles();
    this.loadDefaults();
  }

  loadFromEnvironment() {
    // Primary API keys (user's own)
    this.config.apiKeys = {
      xai: process.env.XAI_API_KEY || xai-An3qboNlZdOZMQ2NPcxlAPCtuZqHDX5wrTy3z9HI0f0I6FmjCKydPAqMiwzU46UHGxMnm6BhpqhqSli3
      openai: process.env.OPENAI_API_KEY || null,
      anthropic: process.env.ANTHROPIC_API_KEY || null
    };

    // Deployment configuration
    this.config.deployment = {
      environment: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT) || 3000,
      logLevel: process.env.LOG_LEVEL || 'info',
      enableMetrics: process.env.ENABLE_METRICS !== 'false'
    };

    // Security settings
    this.config.security = {
      corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
      maxRequestsPerWindow: parseInt(process.env.MAX_REQUESTS_PER_WINDOW) || 100,
      enableEncryption: process.env.ENABLE_ENCRYPTION !== 'false'
    };

    // Integration settings
    this.config.integration = {
      defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'auto',
      enableConsensus: process.env.ENABLE_CONSENSUS === 'true',
      consensusThreshold: parseFloat(process.env.CONSENSUS_THRESHOLD) || 0.7,
      maxRetries: parseInt(process.env.MAX_RETRIES) || 3
    };
  }

  loadFromFiles() {
    // Check for local configuration files
    const configPaths = [
      '.env.local',
      '.env.development',
      '.env.production',
      'config.json'
    ];

    for (const configPath of configPaths) {
      if (existsSync(configPath)) {
        try {
          if (configPath.endsWith('.json')) {
            const fileConfig = JSON.parse(readFileSync(configPath, 'utf8'));
            this.mergeConfig(fileConfig);
          } else {
            // Load .env files
            this.loadEnvFile(configPath);
          }
        } catch (error) {
          console.warn(`Failed to load config from ${configPath}:`, error.message);
        }
      }
    }
  }

  loadEnvFile(filePath) {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  loadDefaults() {
    // Default configuration for demo/development
    const defaults = {
      demo: {
        enabled: true,
        mockLatency: { min: 200, max: 800 },
        sampleResponses: {
          behavioral: "Demo: Normal transaction pattern detected. Risk score: 0.15",
          threat: "Demo: Low threat level. Standard DeFi interaction pattern.",
          consensus: "Demo: Consensus achieved. Confidence: 87%"
        }
      },
      providers: {
        xai: {
          name: 'xAI Grok',
          endpoint: 'https://api.x.ai/v1/chat/completions',
          model: 'grok-beta',
          maxTokens: 2048,
          temperature: 0.3,
          description: 'Advanced reasoning and real-time analysis'
        },
        openai: {
          name: 'OpenAI',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-4',
          maxTokens: 2048,
          temperature: 0.3,
          description: 'Reliable analysis and pattern recognition'
        },
        anthropic: {
          name: 'Anthropic Claude',
          endpoint: 'https://api.anthropic.com/v1/messages',
          model: 'claude-3-sonnet-20240229',
          maxTokens: 2048,
          description: 'Constitutional AI with safety focus'
        }
      },
      features: {
        realTimeAnalysis: true,
        behavioralDetection: true,
        threatAssessment: true,
        economicModeling: true,
        quantumResistance: true
      }
    };

    this.mergeConfig(defaults);
  }

  mergeConfig(newConfig, target = this.config) {
    for (const [key, value] of Object.entries(newConfig)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        target[key] = target[key] || {};
        this.mergeConfig(value, target[key]);
      } else {
        target[key] = value;
      }
    }
  }

  validateConfiguration() {
    // Check for valid configuration
    const errors = [];

    // Validate deployment settings
    if (this.config.deployment.port < 1 || this.config.deployment.port > 65535) {
      errors.push('Invalid port number');
    }

    // Validate security settings
    if (this.config.security.maxRequestsPerWindow < 1) {
      errors.push('Invalid rate limit configuration');
    }

    // Check API key format (basic validation)
    Object.entries(this.config.apiKeys).forEach(([provider, key]) => {
      if (key && (typeof key !== 'string' || key.length < 10)) {
        errors.push(`Invalid API key format for ${provider}`);
      }
    });

    if (errors.length > 0) {
      console.warn('Configuration validation warnings:', errors);
    }

    // Set deployment mode based on available keys
    this.config.deploymentMode = this.determineDeploymentMode();
  }

  determineDeploymentMode() {
    const hasAPIKey = Object.values(this.config.apiKeys).some(key => key !== null);
    
    if (hasAPIKey) {
      return 'production'; // Live AI integration
    } else if (this.config.deployment.environment === 'development') {
      return 'development'; // Full mock capabilities
    } else {
      return 'demo'; // Community demo mode
    }
  }

  getActiveProviders() {
    return Object.entries(this.config.apiKeys)
      .filter(([_, key]) => key !== null)
      .map(([provider, _]) => ({
        name: provider,
        ...this.config.providers[provider],
        status: 'available'
      }));
  }

  getDemoConfiguration() {
    return {
      mode: 'demo',
      message: 'Running in demo mode with simulated AI responses',
      availableFeatures: [
        'Behavioral analysis simulation',
        'Threat detection demo',
        'Real-time processing simulation',
        'Performance metrics tracking'
      ],
      upgradeInstructions: {
        steps: [
          '1. Get API key from https://console.x.ai or https://platform.openai.com',
          '2. Add to environment: XAI_API_KEY=your_key_here',
          '3. Restart application for live AI integration'
        ],
        supportedProviders: Object.keys(this.config.providers)
      }
    };
  }

  getProductionConfiguration() {
    const activeProviders = this.getActiveProviders();
    
    return {
      mode: 'production',
      message: `Live AI integration active with ${activeProviders.length} provider(s)`,
      activeProviders: activeProviders.map(p => ({
        name: p.name,
        model: p.model,
        description: p.description
      })),
      features: {
        realTimeAnalysis: true,
        multiProviderConsensus: activeProviders.length > 1,
        advancedThreatDetection: true,
        customModelTuning: true
      },
      performance: {
        targetLatency: '< 800ms',
        expectedAccuracy: '> 95%',
        scalability: 'Horizontal'
      }
    };
  }

  // Security helpers
  maskAPIKey(key) {
    if (!key) return 'Not configured';
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  }

  getSecureConfig() {
    const secureConfig = JSON.parse(JSON.stringify(this.config));
    
    // Mask API keys in output
    Object.keys(secureConfig.apiKeys).forEach(provider => {
      if (secureConfig.apiKeys[provider]) {
        secureConfig.apiKeys[provider] = this.maskAPIKey(secureConfig.apiKeys[provider]);
      }
    });

    return secureConfig;
  }

  // Dynamic configuration updates
  updateProvider(provider, settings) {
    if (!this.config.providers[provider]) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    this.config.providers[provider] = { ...this.config.providers[provider], ...settings };
    this.validateConfiguration();
  }

  // Health check configuration
  getHealthCheckConfig() {
    return {
      endpoints: {
        basic: '/health',
        detailed: '/health/detailed',
        providers: '/health/providers'
      },
      checks: {
        apiConnectivity: true,
        rateLimits: true,
        responseTime: true,
        errorRates: true
      },
      thresholds: {
        maxLatency:
