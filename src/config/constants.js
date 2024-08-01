const dotenv = require("dotenv");
// Configure dotenv
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

module.exports = {
  PORT: process.env.PORT || 5001,
  API_KEY: process.env.API_KEY || '',

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
  ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || '20m',

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'secret',
  REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME || '1h',

  RESET_PASSWORD_TOKEN_SECRET:
    process.env.RESET_PASSWORD_TOKEN_SECRET || 'secret',
  RESET_PASSWORD_TOKEN_LIFETIME:
    process.env.RESET_PASSWORD_TOKEN_LIFETIME || '10m',

  serverRateLimits: {
    max: 500,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests from this IP address.',
  },

  MONGO_DB_URL: process.env.MONGO_DB_URL || '',

  BASE_URL: process.env.BASE_URL || 'https://example.com',

  defaultCorsOptions: {
    origin: ['http://localhost:3000', 'https://example.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Version'],
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true,
  },

  EMAIL_DOMAIN: process.env.EMAIL_DOMAIN || 'example.com',
  EMAIL_API_KEY: process.env.EMAIL_API_KEY || '',

  userLock: {
    attemptNumber: 5,
    lockPeriod: 2 * 60, // 2 hours
  },
};
