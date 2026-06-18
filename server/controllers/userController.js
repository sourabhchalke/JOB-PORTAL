import User from '../models/User.js';
import JobApplication from '../models/JobApplication.js';
import { Clerk } from '@clerk/clerk-sdk-node';

// Initialize Clerk client
const clerkClient = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

import {v2 as cloudinary} from 'cloudinary';

//Get User data
// export const getUserData = async(req,res)=>{

//     const userId = req.auth.userId;

//     try {
        
//         const user = await User.findById(userId);

//         if(!user){
//             return res.json({success:false,message:"User Not Found"});
//         }

//         res.json({success:true,user});

//     } catch (error) {
//         res.json({success:false,message:error.message});
//     }

// }
//New getUserData Debugging
export const getUserData = async (req, res) => {
  console.log("\n=== GET USER DATA ===");
  console.log("Auth object:", req.auth);
  
  const userId = req.auth?.userId || req.auth?.sub;
  
  if (!userId) {
    console.log("❌ No userId found");
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized - No user ID" 
    });
  }
  
  try {
    console.log("🔍 Looking for user:", userId);
    let user = await User.findById(userId);
    
    if (!user) {
      console.log("❌ User not found, fetching from Clerk...");
      
      try {
        // 🔥 GET REAL USER DATA FROM CLERK
        const clerkUser = await clerkClient.users.getUser(userId);
        console.log("📥 Got Clerk user data:", {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          image: clerkUser.imageUrl
        });
        
        // Create user with REAL data from Clerk
        user = new User({
          _id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
          image: clerkUser.imageUrl || 'https://ui-avatars.com/api/?name=User&background=random',
          resume: ''
        });
        
        await user.save();
        console.log('✅ User created with REAL Clerk data!');
        
      } catch (clerkError) {
        console.error("⚠️ Couldn't get Clerk data:", clerkError.message);
        
        // Fallback: use data from req.auth
        const email = req.auth?.email || `user_${userId.substring(0, 10)}@example.com`;
        const name = req.auth?.name || 'User';
        
        user = new User({
          _id: userId,
          email: email,
          name: name,
          image: 'https://ui-avatars.com/api/?name=User&background=random',
          resume: ''
        });
        
        await user.save();
        console.log('✅ User created with fallback data');
      }
    } else {
      console.log("✅ User found:", user.email);
      
      // Optional: Update user data from Clerk if changed
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
        const clerkName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
        const clerkImage = clerkUser.imageUrl;
        
        // Check if data changed
        if (user.email !== clerkEmail || user.name !== clerkName || user.image !== clerkImage) {
          console.log("🔄 Updating user data from Clerk...");
          user.email = clerkEmail || user.email;
          user.name = clerkName || user.name;
          user.image = clerkImage || user.image;
          await user.save();
          console.log("✅ User updated with latest Clerk data");
        }
      } catch (updateError) {
        console.log("⚠️ Couldn't update user data:", updateError.message);
      }
    }
    
    res.json({ success: true, user });
    
  } catch (error) {
    console.error("❌ Error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      try {
        const existingUser = await User.findOne({ email: error.keyValue?.email });
        if (existingUser) {
          console.log("✅ Found existing user:", existingUser.email);
          return res.json({ success: true, user: existingUser });
        }
      } catch (findError) {
        console.error("Error finding existing user:", findError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};




//Apply for a job
export const applyForJob = async(req,res)=>{

    const {jobId} = req.body;

    const userId = req.auth.userId;

    try {
        
        const isAlreadyApplied = await JobApplication.find({jobId,userId})

        if(isAlreadyApplied.length>0){
            return res.json({success:false,message:'Already Applied'});
        }

        const jobData = await JobApplication.findById(jobId);

        if(!jobData){
            return res.json({success:false,message:'Job Not Found'});
        }

        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })

        res.json({success:true,message:'Applied Successfully'});

    } catch (error) {
        res.json({success:false,message:error.message});
    }

}

//Get user applied applications
export const getUserJobApplications=async(req,res)=>{

    try {
        
        const userId = req.auth.userId;

        const applications = await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec()

        if(!applications){
            return res.json({success:false,message:'No job applications found for this user.'});
        }

        return res.json({success:true,applications});

    } catch (error) {
        res.json({success:false,message:error.message});
    }

}

//Update user profile(resume)
export const updateUserResume = async(req,res)=>{

    try {
        
        const userId = req.auth.userId;

        const resumeFile = req.resumeFile;

        const userData = await User.findById(userId);

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume=resumeUpload.secure_url
        }

        await userData.save();

        return res.json({success:true,message:'Resume Updated'});

    } catch (error) {
        
        res.json({success:false,message:error.message});

    }

}