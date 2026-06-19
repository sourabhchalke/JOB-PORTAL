// import './config/instrument.js'
// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js';
// import * as Sentry from '@sentry/node';
// import { clerkWebhooks } from './controllers/webhooks.js';
// import companyRoutes from './routes/companyRoutes.js';
// import connectCloudinary from './config/cloudinary.js';
// import jobRoutes from './routes/jobRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import {clerkMiddleware} from '@clerk/express';


// // Initialize Express
// const app = express();

// //Connect to Database
// await connectDB();
// await connectCloudinary();


// app.post(
//   '/webhooks',
//   express.raw({ type: 'application/json' }),
//   clerkWebhooks
// );
// //Middlewares
// app.use(cors())

// // app.use((req, res, next) => {
// //   console.log("=== REQUEST DEBUG ===");
// //   console.log("Method:", req.method);
// //   console.log("URL:", req.url);
// //   console.log("Authorization header:", req.headers.authorization ? "✅ Present" : "❌ Missing");
// //   if (req.headers.authorization) {
// //     console.log("Token preview:", req.headers.authorization.substring(0, 30) + "...");
// //   }
// //   console.log("=====================");
// //   next();
// // });
// // app.use(clerkMiddleware());
// // app.use((req, res, next) => {
// //   console.log("=== AFTER CLERK MIDDLEWARE ===");
// //   console.log("req.auth:", req.auth);
// //   console.log("req.auth?.userId:", req.auth?.userId);
// //   console.log("===============================");
// //   next();
// // });
// // Custom Clerk Auth Middleware (Replaces clerkMiddleware)
// app.use(async (req, res, next) => {
//   console.log("🔐 Custom Clerk Auth Middleware");
  
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     console.log("❌ No Bearer token found");
//     req.auth = null;
//     return next();
//   }
  
//   const token = authHeader.substring(7);
//   console.log("Token received:", token.substring(0, 30) + "...");
  
//   try {
//     // Verify the token with Clerk
//     const payload = await clerk.verifyToken(token);
//     console.log("✅ Token verified successfully!");
//     console.log("User ID:", payload.sub);
    
//     // Set auth object on request
//     req.auth = {
//       userId: payload.sub,
//       sessionId: payload.sid,
//       ...payload
//     };
    
//     console.log("✅ req.auth.userId set to:", req.auth.userId);
//   } catch (error) {
//     console.log("❌ Token verification failed:", error.message);
//     req.auth = null;
//   }
  
//   next();
// });


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Routes
// app.get('/',(req,res)=>res.send("API Working"))

// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });

// app.post('/test', (req, res) => {
//     console.log("Test Route Hit");
//     res.json({ success: true });
// });

// app.use('/api/company',companyRoutes);
// app.use('/api/jobs',jobRoutes);
// app.use('/api/users',userRoutes);


// // PORT
// const PORT = process.env.PORT || 5000

// Sentry.setupExpressErrorHandler(app);

// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// })


import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { Clerk } from '@clerk/clerk-sdk-node';

// Initialize Express
const app = express();

// Connect to Database
await connectDB();
await connectCloudinary();

// ========== INITIALIZE CLERK ==========
// This is the critical part you were missing!
const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

// console.log("✅ Clerk initialized with secret key:", process.env.CLERK_SECRET_KEY ? "Present" : "Missing");

// ========== MIDDLEWARE ==========

// 1. CORS
app.use(cors());

// 2. Custom Clerk Auth Middleware
app.use(async (req, res, next) => {
  // console.log("\n🔐 Custom Clerk Auth Middleware");
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // console.log("❌ No Bearer token found");
    req.auth = null;
    return next();
  }
  
  const token = authHeader.substring(7);
  // console.log("Token received:", token.substring(0, 30) + "...");
  
  try {
    // Verify the token with Clerk
    const payload = await clerk.verifyToken(token);
    // console.log("✅ Token verified successfully!");
    // console.log("User ID:", payload.sub);
    // console.log("Session ID:", payload.sid);
    
    // Set auth object on request
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
      ...payload
    };
    
    // console.log("✅ req.auth.userId set to:", req.auth.userId);
  } catch (error) {
    // console.log("❌ Token verification failed:", error.message);
    // console.log("Error details:", error);
    req.auth = null;
  }
  
  next();
});

// 3. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Webhooks (must be before body parsing for raw body)
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// ========== ROUTES ==========

app.get('/', (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Debug route to check auth
app.get('/api/auth-check', (req, res) => {
  console.log("\n=== AUTH CHECK ===");
  console.log("req.auth:", req.auth);
  console.log("req.auth?.userId:", req.auth?.userId);
  
  res.json({
    hasAuth: !!req.auth,
    userId: req.auth?.userId || null,
    sessionId: req.auth?.sessionId || null,
    message: req.auth?.userId ? "✅ Auth working!" : "❌ No auth found"
  });
});

app.post('/test', (req, res) => {
  console.log("Test Route Hit");
  res.json({ success: true });
});

// Your routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// ========== ERROR HANDLING ==========
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
