const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { CLIENT_URL } = require('./config/env');

const contactRoutes = require("./routes/contact.routes");
const adminRoutes = require("./routes/admin.routes");
const cmsRoutes = require("./routes/cms.routes");
const { adminLogin } = require('./middlewares/auth.middleware');
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co"],
    },
  },
  referrerPolicy: { policy: 'same-origin' },
}));

// Rate limiting for public endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Specific rate limiting for form submissions
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 form submissions per windowMs
  message: 'Too many form submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/contact', formLimiter);

// Data sanitization - skip mongoSanitize and xss-clean due to compatibility issues, rely on input validation and helmet
// XSS protection is handled by helmet and input validation

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [CLIENT_URL];

    // Add common development origins
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push('http://localhost:5173');
      allowedOrigins.push('http://127.0.0.1:5173');
      allowedOrigins.push('http://localhost:3000');
    }

    if (CLIENT_URL && CLIENT_URL.endsWith('/')) {
      allowedOrigins.push(CLIENT_URL.slice(0, -1));
    } else if (CLIENT_URL) {
      allowedOrigins.push(`${CLIENT_URL}/`);
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.some(o => o && origin.startsWith(o))) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed. CLIENT_URL: ${CLIENT_URL}`);
      callback(null, false); // Return false instead of Error to avoid stack traces in client if desired, or stay with Error but log the mismatch
    }
  },
  credentials: true
}));
app.use(morgan("dev"));

app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cms", cmsRoutes);

// Rate limiting for admin login to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Zyron Semiconductors API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// Admin authentication endpoint
app.post('/api/admin/login', loginLimiter, adminLogin);

app.use(errorHandler);

module.exports = app;
