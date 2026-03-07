const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// ── Security Middleware ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Rate Limiting ────────────────────────────────────────────
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests. Try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many auth requests. Try again later.' } });

app.use('/api/', apiLimiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Static Files (uploaded documents) ───────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth.routes'));
app.use('/api/pass',   require('./routes/pass.routes'));
app.use('/api/admin',  require('./routes/admin.routes'));
app.use('/api/public', require('./routes/public.routes'));
app.use('/api/user',   require('./routes/user.routes'));

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Server is running 🚌', env: process.env.NODE_ENV }));

// ── 404 Handler ──────────────────────────────────────────────
app.use('*', (req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` }));

// ── Global Error Handler (must be last) ──────────────────────
app.use(errorHandler);

module.exports = app;
