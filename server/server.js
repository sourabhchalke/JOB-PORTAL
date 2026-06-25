// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js';
// import connectCloudinary from './config/cloudinary.js';
// import companyRoutes from './routes/companyRoutes.js';
// import jobRoutes from './routes/jobRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import { clerkWebhooks } from './controllers/webhooks.js';
// import { Clerk } from '@clerk/clerk-sdk-node';

// const app = express();

// // ========== DATABASE CONNECTION ==========
// let dbConnected = false;
// try {
//   await connectDB();
//   dbConnected = true;
//   console.log('✅ Database connected');
// } catch (error) {
//   console.error('❌ Database connection failed:', error.message);
// }

// try {
//   await connectCloudinary();
//   console.log('✅ Cloudinary connected');
// } catch (error) {
//   console.error('❌ Cloudinary connection failed:', error.message);
// }

// // ========== CLERK INITIALIZATION ==========
// const clerk = new Clerk({
//   secretKey: process.env.CLERK_SECRET_KEY
// });

// // ========== CORS CONFIGURATION - FIXED ==========
// const allowedOrigins = [
//   'https://job-portal-new-client-jade.vercel.app',
//   'https://job-portal-new-client-7jk8kirj2-sourabh-chalkes-projects.vercel.app',
//   'http://localhost:5173',
//   'http://localhost:3000'
// ];

// // CORS middleware - MUST be first
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
  
//   // Log all requests for debugging
//   console.log(`📨 ${req.method} ${req.url}`);
  
//   // Allow all origins in development, specific in production
//   if (process.env.NODE_ENV === 'development') {
//     res.header('Access-Control-Allow-Origin', origin || '*');
//   } else if (origin && allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   } else if (!origin) {
//     res.header('Access-Control-Allow-Origin', '*');
//   }
  
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Expose-Headers', 'Authorization');
  
//   // Handle preflight
//   if (req.method === 'OPTIONS') {
//     return res.status(200).json({});
//   }
  
//   next();
// });

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // ========== AUTH MIDDLEWARE ==========
// app.use(async (req, res, next) => {
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     req.auth = null;
//     return next();
//   }
  
//   const token = authHeader.substring(7);
  
//   try {
//     const payload = await clerk.verifyToken(token);
//     req.auth = {
//       userId: payload.sub,
//       sessionId: payload.sid,
//       ...payload
//     };
//     console.log('✅ Auth successful for:', req.auth.userId);
//   } catch (error) {
//     console.log('❌ Auth failed:', error.message);
//     req.auth = null;
//   }
  
//   next();
// });

// // ========== WEBHOOKS ==========
// app.post(
//   '/webhooks',
//   express.raw({ type: 'application/json' }),
//   clerkWebhooks
// );

// // ========== ROUTES ==========

// // Health check route
// app.get('/', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'API is running!',
//     timestamp: new Date().toISOString(),
//     database: dbConnected ? 'connected' : 'disconnected'
//   });
// });

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'API test endpoint is working!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Auth check
// app.get('/api/auth-check', (req, res) => {
//   res.json({
//     hasAuth: !!req.auth,
//     userId: req.auth?.userId || null,
//     message: req.auth?.userId ? "✅ Auth working!" : "❌ No auth found"
//   });
// });

// // Your actual routes
// app.use('/api/company', companyRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/users', userRoutes);

// // 404 handler - catch all undefined routes
// app.use('*', (req, res) => {
//   console.log('❌ 404:', req.method, req.url);
//   res.status(404).json({ 
//     success: false, 
//     message: `Route not found: ${req.method} ${req.url}` 
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err.message);
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: err.message || 'Internal Server Error'
//   });
// });

// // ========== EXPORT FOR VERCEL ==========
// export default app;

// // ========== LOCAL DEVELOPMENT ==========
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// }

//New Server.js file
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

// ========== SECURITY HEADERS ==========
app.use((req, res, next) => {
  // Security headers to prevent Chrome warnings
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// ========== CORS CONFIGURATION ==========
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow all Vercel domains
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow specific frontend URLs
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://job-portal-new-client.vercel.app',
      'https://job-portal-new-client-csh0tnaqq-sourabh-chalkes-projects.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log(`⚠️ CORS allowing origin: ${origin}`);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['Authorization', 'Content-Length', 'X-Total-Count']
}));

// ========== REQUEST LOGGING ==========
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log(`📍 Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ========== DATABASE CONNECTION ==========
let dbConnected = false;
try {
  await connectDB();
  dbConnected = true;
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
}

try {
  await connectCloudinary();
  console.log('✅ Cloudinary connected');
} catch (error) {
  console.error('❌ Cloudinary connection failed:', error.message);
}

// ========== CLERK INITIALIZATION ==========
const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

// ========== MIDDLEWARE ==========
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ========== AUTH MIDDLEWARE ==========
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
    console.log(`✅ Auth successful for user: ${req.auth.userId}`);
  } catch (error) {
    console.log(`❌ Auth failed: ${error.message}`);
    req.auth = null;
  }
  
  next();
});

// ========== WEBHOOKS ==========
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// ========== ROUTES ==========

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running!',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working!',
    timestamp: new Date().toISOString(),
    requestOrigin: req.headers.origin || 'Same-origin'
  });
});

// Auth check
app.get('/api/auth-check', (req, res) => {
  res.json({
    hasAuth: !!req.auth,
    userId: req.auth?.userId || null,
    message: req.auth?.userId ? "✅ Auth working!" : "❌ No auth found"
  });
});

// Routes listing
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

// ========== YOUR ACTUAL ROUTES ==========
console.log('📡 Registering routes...');
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
console.log('✅ Routes registered');

// ========== 404 HANDLER ==========
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: [
      '/',
      '/api/test',
      '/api/auth-check',
      '/api/routes',
      '/api/jobs',
      '/api/company',
      '/api/users',
      '/webhooks'
    ]
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error'
  });
});

// ========== EXPORT FOR VERCEL ==========
export default app;

// ========== LOCAL DEVELOPMENT ==========
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}