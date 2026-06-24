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

// ========== CORS CONFIGURATION - FIXED ==========
// Option 1: Allow all Vercel deployments (RECOMMENDED)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log all requests for debugging
  console.log(`📨 ${req.method} ${req.url} from ${origin || 'unknown'}`);
  
  // Allow any origin that contains 'vercel.app' or 'localhost'
  const isAllowed = !origin || 
    origin.includes('vercel.app') || 
    origin.includes('localhost') ||
    origin === 'null';
  
  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    res.header('Access-Control-Max-Age', '86400');
  } else {
    console.log(`❌ CORS blocked for: ${origin}`);
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  
  next();
});

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
    console.log('✅ Auth successful for:', req.auth.userId);
  } catch (error) {
    console.log('❌ Auth failed:', error.message);
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
  res.json({ 
    success: true, 
    message: 'API is running!',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working!',
    timestamp: new Date().toISOString()
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

// Your actual routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// 404 handler - catch all undefined routes
app.use('*', (req, res) => {
  console.log('❌ 404:', req.method, req.url);
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.url}` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error(err.stack);
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
    console.log('📡 CORS: All Vercel and localhost origins allowed');
  });
}