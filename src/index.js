// Import required packages and modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Initialize express app
const app = express();

// Import custom modules and configurations
const connectToDb = require('./config/db');
const { authRouter, userRouter } = require('./routes');
const {
  defaultCorsOptions,
  PORT,
  serverRateLimits,
} = require('./config/constants');
const { apiKeyMiddleware } = require('./middlewares/API');

// Connect to MongoDB database
connectToDb();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(apiKeyMiddleware);
app.use('/', cors(defaultCorsOptions));

// Configure rate limiting
const serverRateLimitsConfig = rateLimit({
  windowMs: serverRateLimits.windowMs,
  max: serverRateLimits.max,
  message: serverRateLimits.message,
});
app.use(serverRateLimitsConfig);

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app
module.exports = app;
