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
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import { Clerk } from '@clerk/clerk-sdk-node';

const app = express();

// ========== CORS CONFIGURATION - FIXED FOR VERCEL ==========
// Use the cors package as the primary CORS handler
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://job-portal-new-client-csh0tnaqq-sourabh-chalkes-projects.vercel.app',
      'https://job-portal-new-client.vercel.app',
      // Allow any Vercel app
      /.+\.vercel\.app$/
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      }
      return pattern.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['Authorization', 'Content-Length', 'X-Total-Count'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS before ANY other middleware
app.use(cors(corsOptions));

// Additional CORS headers for safety
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// ========== REQUEST LOGGING MIDDLEWARE ==========
app.use((req, res, next) => {
  console.log('========================================');
  console.log(`📨 REQUEST: ${req.method} ${req.url}`);
  console.log(`📍 Origin: ${req.headers.origin || 'No origin'}`);
  
  // FIX: Safely check if body exists before using Object.keys
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  console.log(`🔑 Auth header: ${req.headers.authorization ? 'Present' : 'Missing'}`);
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
  console.log('⚠️ Server will continue without database');
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
  console.log(`🔐 Auth check: ${authHeader ? 'Header present' : 'No auth header'}`);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.auth = null;
    console.log('⚠️ No valid auth token found');
    return next();
  }
  
  const token = authHeader.substring(7);
  console.log(`🔑 Token length: ${token.length} characters`);
  
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

// Health check route
app.get('/', (req, res) => {
  console.log('🏥 Health check requested');
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
  console.log('🧪 Test endpoint requested');
  res.json({ 
    success: true, 
    message: 'API test endpoint is working!',
    timestamp: new Date().toISOString(),
    requestOrigin: req.headers.origin || 'Same-origin',
    requestMethod: req.method
  });
});

// Auth check
app.get('/api/auth-check', (req, res) => {
  console.log('🔐 Auth check endpoint requested');
  res.json({
    hasAuth: !!req.auth,
    userId: req.auth?.userId || null,
    message: req.auth?.userId ? "✅ Auth working!" : "❌ No auth found",
    headers: {
      hasAuthorization: !!req.headers.authorization,
      origin: req.headers.origin || 'none'
    }
  });
});

// Routes listing endpoint
app.get('/api/routes', (req, res) => {
  console.log('📋 Routes list requested');
  const routes = [];
  
  try {
    if (app._router && app._router.stack) {
      app._router.stack.forEach(middleware => {
        if (middleware.route) {
          routes.push({
            path: middleware.route.path,
            methods: Object.keys(middleware.route.methods)
          });
        } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
          const basePath = middleware.regexp.source
            .replace(/\\\//g, '/')
            .replace(/\^/g, '')
            .replace(/\?/g, '')
            .replace(/\(\?:\(\[\^\\\/\]\+\)\)/g, '/:path*');
          
          middleware.handle.stack.forEach(handler => {
            if (handler.route) {
              routes.push({
                path: `${basePath}${handler.route.path}`,
                methods: Object.keys(handler.route.methods)
              });
            }
          });
        }
      });
    }
    
    res.json({
      success: true,
      routes: routes,
      totalRoutes: routes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error listing routes:', error.message);
    res.json({
      success: false,
      message: error.message,
      routes: [],
      totalRoutes: 0
    });
  }
});

// ========== YOUR ACTUAL ROUTES ==========
console.log('📡 Registering routes...');
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
console.log('✅ Routes registered');

// ========== DEBUG: Log all registered routes ==========
console.log('📋 Registered Routes:');

const safeLogRoute = (method, path) => {
  console.log(`  ${method.padEnd(10)} ${path}`);
};

try {
  safeLogRoute('GET', '/');
  safeLogRoute('GET', '/api/test');
  safeLogRoute('GET', '/api/auth-check');
  safeLogRoute('GET', '/api/routes');
  safeLogRoute('POST', '/webhooks');
  
  if (app._router && app._router.stack) {
    app._router.stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        safeLogRoute(methods, layer.route.path);
      }
    });
  }
  
  console.log('  📁 /api/company/*');
  console.log('  📁 /api/jobs/*');
  console.log('  📁 /api/users/*');
  
} catch (error) {
  console.log('  ⚠️ Could not log all routes:', error.message);
  console.log('  📁 /api/company/*');
  console.log('  📁 /api/jobs/*');
  console.log('  📁 /api/users/*');
}

// ========== 404 HANDLER ==========
app.use((req, res) => {
  console.log(`❌ 404 ERROR: ${req.method} ${req.originalUrl}`);
  console.log(`🔍 Available routes: /api/jobs, /api/company, /api/users, /api/test, /api/auth-check`);
  
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      '/',
      '/api/test',
      '/api/auth-check',
      '/api/routes',
      '/api/jobs',
      '/api/company',
      '/api/users',
      '/webhooks'
    ],
    timestamp: new Date().toISOString()
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:');
  console.error(`📌 Error: ${err.message}`);
  console.error(`📌 Stack: ${err.stack}`);
  
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// ========== EXPORT FOR VERCEL ==========
export default app;

// ========== LOCAL DEVELOPMENT ==========
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📡 CORS: Allowed origins configured');
    console.log('📋 Available endpoints:');
    console.log('  - GET  /');
    console.log('  - GET  /api/test');
    console.log('  - GET  /api/auth-check');
    console.log('  - GET  /api/routes');
    console.log('  - POST /webhooks');
    console.log('  - GET  /api/jobs');
    console.log('  - GET  /api/company');
    console.log('  - GET  /api/users');
    console.log('========================================');
  });
}