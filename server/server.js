import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import { Clerk } from '@clerk/clerk-sdk-node';

const app = express();

// ============================================
// SECURITY HEADERS
// ============================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ============================================
// CORS CONFIGURATION - FIXED FOR VERCEL
// ============================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://job-portal-new-client.vercel.app',
  'https://job-portal-new-client-csh0tnaqq-sourabh-chalkes-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow any Vercel domain (important for production)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Check against allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log(`⚠️ CORS allowing origin (debug): ${origin}`);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization', 'Content-Length', 'X-Total-Count'],
  maxAge: 86400
}));

// ============================================
// REQUEST LOGGING
// ============================================
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log(`📍 Origin: ${req.headers.origin || 'No origin'}`);
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================
let dbConnected = false;
let cloudinaryConnected = false;

try {
  await connectDB();
  dbConnected = true;
  console.log('✅ Database connected successfully');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
}

try {
  await connectCloudinary();
  cloudinaryConnected = true;
  console.log('✅ Cloudinary connected successfully');
} catch (error) {
  console.error('❌ Cloudinary connection failed:', error.message);
}

// ============================================
// CLERK INITIALIZATION
// ============================================
const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// AUTH MIDDLEWARE
// ============================================
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.auth = null;
    return next();
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = await clerk.verifyToken(token);
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      ...payload
    };
    console.log(`✅ Auth successful: ${req.auth.userId}`);
  } catch (error) {
    console.log(`❌ Auth failed: ${error.message}`);
    req.auth = null;
  }
  
  next();
});

// ============================================
// WEBHOOKS
// ============================================
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// ============================================
// HEALTH CHECK & TEST ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 Job Portal API is running!',
    timestamp: new Date().toISOString(),
    database: dbConnected ? '✅ connected' : '❌ disconnected',
    cloudinary: cloudinaryConnected ? '✅ connected' : '❌ disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Test endpoint is working!',
    timestamp: new Date().toISOString(),
    requestOrigin: req.headers.origin || 'Same-origin',
    requestMethod: req.method
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

app.get('/api/routes', (req, res) => {
  const routes = [];
  try {
    if (app._router && app._router.stack) {
      app._router.stack.forEach((layer) => {
        if (layer.route) {
          routes.push({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods)
          });
        }
      });
    }
  } catch (error) {
    console.error('Error listing routes:', error.message);
  }
  
  res.json({
    success: true,
    routes: routes,
    totalRoutes: routes.length,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// YOUR ACTUAL ROUTES
// ============================================
console.log('📡 Registering routes...');
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
console.log('✅ Routes registered');

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: [
      '/',
      '/api/test',
      '/api/health',
      '/api/routes',
      '/api/jobs',
      '/api/company',
      '/api/users',
      '/webhooks'
    ],
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// EXPORT FOR VERCEL
// ============================================
export default app;

// ============================================
// LOCAL DEVELOPMENT
// ============================================
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📡 Environment:', process.env.NODE_ENV || 'development');
    console.log('========================================');
    console.log('📋 Available Endpoints:');
    console.log('  - GET  /');
    console.log('  - GET  /api/test');
    console.log('  - GET  /api/health');
    console.log('  - GET  /api/routes');
    console.log('  - POST /webhooks');
    console.log('  - GET  /api/jobs');
    console.log('  - GET  /api/company');
    console.log('  - GET  /api/users');
    console.log('========================================');
  });
}