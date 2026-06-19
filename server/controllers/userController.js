// import mongoose from 'mongoose';
// import User from '../models/User.js';
// import JobApplication from '../models/JobApplication.js';
// import { Clerk } from '@clerk/clerk-sdk-node';

// // Initialize Clerk client
// const clerkClient = new Clerk({
//   secretKey: process.env.CLERK_SECRET_KEY
// });

// import {v2 as cloudinary} from 'cloudinary';

// //Get User data
// // export const getUserData = async(req,res)=>{

// //     const userId = req.auth.userId;

// //     try {

// //         const user = await User.findById(userId);

// //         if(!user){
// //             return res.json({success:false,message:"User Not Found"});
// //         }

// //         res.json({success:true,user});

// //     } catch (error) {
// //         res.json({success:false,message:error.message});
// //     }

// // }
// //New getUserData Debugging
// export const getUserData = async (req, res) => {
//   // console.log("\n=== GET USER DATA ===");
//   // console.log("Auth object:", req.auth);

//   const userId = req.auth?.userId || req.auth?.sub;

//   if (!userId) {
//     // console.log("❌ No userId found");
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized - No user ID"
//     });
//   }

//   try {
//     // console.log("🔍 Looking for user:", userId);
//     let user = await User.findById(userId);

//     if (!user) {
//       // console.log("❌ User not found, fetching from Clerk...");

//       try {
//         // 🔥 GET REAL USER DATA FROM CLERK
//         const clerkUser = await clerkClient.users.getUser(userId);
//         // console.log("📥 Got Clerk user data:", {
//         //   id: clerkUser.id,
//         //   email: clerkUser.emailAddresses[0]?.emailAddress,
//         //   name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
//         //   image: clerkUser.imageUrl
//         // });

//         // Create user with REAL data from Clerk
//         user = new User({
//           _id: userId,
//           email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
//           name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
//           image: clerkUser.imageUrl || 'https://ui-avatars.com/api/?name=User&background=random',
//           resume: ''
//         });

//         await user.save();
//         console.log('✅ User created with REAL Clerk data!');

//       } catch (clerkError) {
//         console.error("⚠️ Couldn't get Clerk data:", clerkError.message);

//         // Fallback: use data from req.auth
//         const email = req.auth?.email || `user_${userId.substring(0, 10)}@example.com`;
//         const name = req.auth?.name || 'User';

//         user = new User({
//           _id: userId,
//           email: email,
//           name: name,
//           image: 'https://ui-avatars.com/api/?name=User&background=random',
//           resume: ''
//         });

//         await user.save();
//         console.log('✅ User created with fallback data');
//       }
//     } else {
//       console.log("✅ User found:", user.email);

//       // Optional: Update user data from Clerk if changed
//       try {
//         const clerkUser = await clerkClient.users.getUser(userId);
//         const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
//         const clerkName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
//         const clerkImage = clerkUser.imageUrl;

//         // Check if data changed
//         if (user.email !== clerkEmail || user.name !== clerkName || user.image !== clerkImage) {
//           console.log("🔄 Updating user data from Clerk...");
//           user.email = clerkEmail || user.email;
//           user.name = clerkName || user.name;
//           user.image = clerkImage || user.image;
//           await user.save();
//           console.log("✅ User updated with latest Clerk data");
//         }
//       } catch (updateError) {
//         console.log("⚠️ Couldn't update user data:", updateError.message);
//       }
//     }

//     res.json({ success: true, user });

//   } catch (error) {
//     console.error("❌ Error:", error);

//     // Handle duplicate key error
//     if (error.code === 11000) {
//       try {
//         const existingUser = await User.findOne({ email: error.keyValue?.email });
//         if (existingUser) {
//           console.log("✅ Found existing user:", existingUser.email);
//           return res.json({ success: true, user: existingUser });
//         }
//       } catch (findError) {
//         console.error("Error finding existing user:", findError);
//       }
//     }

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// //Apply for a job
// // export const applyForJob = async(req,res)=>{

// //     const {jobId} = req.body;

// //     const userId = req.auth.userId;

// //     try {

// //         const isAlreadyApplied = await JobApplication.find({jobId,userId})

// //         if(isAlreadyApplied.length>0){
// //             return res.json({success:false,message:'Already Applied'});
// //         }

// //         const jobData = await JobApplication.findById(jobId);

// //         if(!jobData){
// //             return res.json({success:false,message:'Job Not Found'});
// //         }

// //         await JobApplication.create({
// //             companyId:jobData.companyId,
// //             userId,
// //             jobId,
// //             date:Date.now()
// //         })

// //         res.json({success:true,message:'Applied Successfully'});

// //     } catch (error) {
// //         res.json({success:false,message:error.message});
// //     }

// // }

// //New applyForJob Debugging
// export const applyForJob = async (req, res) => {
//     console.log("\n=== APPLY FOR JOB ===");
//     console.log("Request body:", req.body);
//     console.log("User ID from auth:", req.auth?.userId);

//     const { jobId } = req.body;
//     const userId = req.auth?.userId;

//     if (!jobId) {
//         console.log("❌ No jobId provided");
//         return res.status(400).json({
//             success: false,
//             message: "Job ID is required"
//         });
//     }

//     if (!userId) {
//         console.log("❌ No userId found");
//         return res.status(401).json({
//             success: false,
//             message: "User not authenticated"
//         });
//     }

//     try {
//         // ✅ Validate if jobId is a valid MongoDB ObjectId
//         if (!mongoose.Types.ObjectId.isValid(jobId)) {
//             console.log("❌ Invalid ObjectId format:", jobId);
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid job ID format"
//             });
//         }

//         // ✅ Find the job in Job collection
//         console.log("🔍 Looking for job with ID:", jobId);
//         const jobData = await Job.findById(jobId);

//         if (!jobData) {
//             console.log("❌ Job not found with ID:", jobId);

//             // Check if job exists with different ID format
//             console.log("🔍 Checking if job exists with string ID...");
//             const jobAsString = await Job.findOne({ _id: jobId.toString() });
//             if (jobAsString) {
//                 console.log("✅ Found job with string ID!");
//                 // Use this job instead
//                 const jobData = jobAsString;
//                 // Continue with application...
//             } else {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Job Not Found'
//                 });
//             }
//         } else {
//             console.log("✅ Job found:", jobData.title);
//             console.log("✅ Job data:", {
//                 id: jobData._id,
//                 title: jobData.title,
//                 companyId: jobData.companyId || jobData.company
//             });

//             // ✅ Check if user already applied
//             console.log("🔍 Checking if user already applied...");
//             const existingApplication = await JobApplication.findOne({
//                 jobId: jobId,
//                 userId: userId
//             });

//             if (existingApplication) {
//                 console.log("❌ User already applied for this job");
//                 return res.status(400).json({
//                     success: false,
//                     message: 'You have already applied for this job'
//                 });
//             }

//             // ✅ Check if user has resume
//             const user = await User.findById(userId);
//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'User not found'
//                 });
//             }

//             if (!user.resume) {
//                 console.log("❌ User hasn't uploaded resume");
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Please upload your resume before applying'
//                 });
//             }

//             // ✅ Create application
//             console.log("📝 Creating job application...");
//             const application = await JobApplication.create({
//                 companyId: jobData.companyId || jobData.company,
//                 userId: userId,
//                 jobId: jobId,
//                 date: new Date(),
//                 status: 'pending'
//             });

//             console.log("✅ Application created with ID:", application._id);

//             // ✅ Update job's applicants (if applicants array exists)
//             if (jobData.applicants) {
//                 if (!jobData.applicants.includes(userId)) {
//                     jobData.applicants.push(userId);
//                     await jobData.save();
//                     console.log("✅ Updated job applicants list");
//                 }
//             }

//             // ✅ Update user's applied jobs (if appliedJobs array exists)
//             if (user.appliedJobs) {
//                 if (!user.appliedJobs.includes(jobId)) {
//                     user.appliedJobs.push(jobId);
//                     await user.save();
//                     console.log("✅ Updated user's applied jobs list");
//                 }
//             }

//             console.log("✅ Application completed!");
//             res.json({
//                 success: true,
//                 message: 'Applied Successfully',
//                 application: application
//             });
//         }

//     } catch (error) {
//         console.error("❌ Error in applyForJob:", error);

//         // Handle duplicate key error
//         if (error.code === 11000) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'You have already applied for this job'
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// //Get user applied applications
// export const getUserJobApplications=async(req,res)=>{

//     try {

//         const userId = req.auth.userId;

//         const applications = await JobApplication.find({userId})
//         .populate('companyId','name email image')
//         .populate('jobId','title description location category level salary')
//         .exec()

//         if(!applications){
//             return res.json({success:false,message:'No job applications found for this user.'});
//         }

//         return res.json({success:true,applications});

//     } catch (error) {
//         res.json({success:false,message:error.message});
//     }

// }

// //Update user profile(resume)
// export const updateUserResume = async(req,res)=>{

//     try {

//         const userId = req.auth.userId;

//         const resumeFile = req.file;

//         const userData = await User.findById(userId);

//         if(resumeFile){
//             const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
//             userData.resume=resumeUpload.secure_url
//         }

//         await userData.save();

//         return res.json({success:true,message:'Resume Updated'});

//     } catch (error) {

//         res.json({success:false,message:error.message});

//     }

// }

// controllers/userController.js
import mongoose from "mongoose";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";

// GET User Data
export const getUserData = async (req, res) => {
  console.log("\n=== GET USER DATA ===");
  console.log("Auth object:", req.auth);

  const userId = req.auth?.userId || req.auth?.sub;

  if (!userId) {
    console.log("❌ No userId found");
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No user ID",
    });
  }

  try {
    console.log("🔍 Looking for user:", userId);
    let user = await User.findById(userId);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.email);
    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// APPLY For Job
export const applyForJob = async (req, res) => {
  console.log("\n=== APPLY FOR JOB ===");
  console.log("Request body:", req.body);
  console.log("User ID from auth:", req.auth?.userId);

  const { jobId } = req.body;
  const userId = req.auth?.userId;

  if (!jobId) {
    console.log("❌ No jobId provided");
    return res.status(400).json({
      success: false,
      message: "Job ID is required",
    });
  }

  if (!userId) {
    console.log("❌ No userId found");
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      console.log("❌ Invalid ObjectId format:", jobId);
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    // Find the job
    console.log("🔍 Looking for job with ID:", jobId);
    const jobData = await Job.findById(jobId);

    if (!jobData) {
      console.log("❌ Job not found");
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }

    console.log("✅ Job found:", jobData.title);

    // Check if already applied
    console.log("🔍 Checking if user already applied...");
    const existingApplication = await JobApplication.findOne({
      jobId: jobId,
      userId: userId,
    });

    if (existingApplication) {
      console.log("❌ Already applied");
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Check if user has resume
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resume) {
      console.log("❌ No resume uploaded");
      return res.status(400).json({
        success: false,
        message: "Please upload your resume before applying",
      });
    }

    // Create application
    console.log("📝 Creating job application...");
    const application = await JobApplication.create({
      companyId: jobData.companyId || jobData.company || jobData.company_id,
      userId: userId,
      jobId: jobId,
      date: new Date(),
      status: "pending",
    });

    console.log("✅ Application created:", application._id);

    // Update job applicants
    if (jobData.applicants && !jobData.applicants.includes(userId)) {
      jobData.applicants.push(userId);
      await jobData.save();
    }

    // Update user's applied jobs
    if (user.appliedJobs && !user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
    }

    res.json({
      success: true,
      message: "Applied Successfully",
      application: application,
    });
  } catch (error) {
    console.error("❌ Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET User Job Applications
export const getUserJobApplications = async (req, res) => {
  console.log("\n=== GET USER APPLICATIONS ===");

  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const applications = await JobApplication.find({ userId })
      .populate({
      path: "companyId",
      select: "-password -__v" // Exclude password and version key from company
    })
    .populate({
      path: "jobId",
      select: "-date -visible -companyId -__v" // Exclude date, visible, companyId, and __v from job
    })
    .sort({ date: -1 });

    console.log(`📊 Found ${applications.length} applications`);

    res.json({
      success: true,
      applications: applications,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE User Resume
export const updateUserResume = async (req, res) => {
  console.log("\n=== UPDATE RESUME ===");

  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Update user's resume
    const user = await User.findByIdAndUpdate(
      userId,
      { resume: req.file.path || req.file.filename },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ Resume updated for user:", user.email);
    res.json({
      success: true,
      message: "Resume updated successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
