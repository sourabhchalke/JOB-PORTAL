
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
