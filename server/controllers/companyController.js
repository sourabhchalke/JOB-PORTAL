// import Company from '../models/Company.js';
// import bcrypt from 'bcrypt';
// import {v2 as cloudinary} from 'cloudinary';
// import generateToken from '../utils/generateToken.js';

// //Register a new company
// export const registerCompany = async (req,res)=>{

//     const {name,email,password}=req.body;

//     const imageFile = req.file;

//     if(!name || !email || !password || !imageFile){
//         return res.json({success:false,message:"Missing Details"})
//     }

//         // DEBUG: Check what credentials are being used
//         console.log("=== Cloudinary Debug ===");
//         console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
//         console.log("API Key:", process.env.CLOUDINARY_API_KEY);
//         console.log("API Secret Length:", process.env.CLOUDINARY_API_SECRET?.length);
//         console.log("API Secret First 5 chars:", process.env.CLOUDINARY_API_SECRET?.substring(0, 5));

//     try {

//         const companyExists = await Company.findOne({email});

//         if(companyExists){
//             return res.json({success:false,message:"Company already registered"});
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password,salt);

//         const imageUpload = await cloudinary.uploader.upload(imageFile.path);

//         const company = await Company.create({
//             name,
//             email,
//             password:hashPassword,
//             image:imageUpload.secure_url
//         })

//         res.json({
//             success:true,
//             company:{
//                 _id:company._id,
//                 name:company.name,
//                 email:company.email,
//                 image:company.image

//             },

//             token:generateToken(company._id)

//         })

//     } catch (error) {
//         res.json({success:false,message:error.message});

//     }

// }

// //Company Login
// export const loginCompany = async () =>{

// }

// //Get company data
// export const getCompanyData = async(req,res)=>{

// }

// //Post a new job
// export const postJob = async(req,res)=>{

// }

// //Get Company Job Applicants
// export const getCompanyJobApplicants = async(req,res)=>{

// }

// //Get Company Posted Jobs
// export const getCompanyPostedJobs = async(req,res)=>{

// }

// //Change Job Application Status
// export const ChangeJobApplicationsStatus = async(req,res)=>{

// }

// //Change Job Visiblity
// export const changeVisiblity = async(req,res)=>{

// }

//New
import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import fs from "fs"; // For deleting temp file after upload

// Register a new company
export const registerCompany = async (req, res) => {
  //     // Debug logging
  //     console.log("=== Request Debug ===");
  //     console.log("req.body:", req.body);
  //     console.log("req.file:", req.file);
  //     console.log('Cloudinary Config Check:', {
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
  //   api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
  //   api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
  // });
  // // Add this to see your actual cloud name
  // console.log('Actual Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

  const { name, email, password } = req.body;
  const imageFile = req.file;

  // Validation
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details: Name, email, and password are required",
    });
  }

  if (!imageFile) {
    return res.json({
      success: false,
      message: "Company logo/image is required",
    });
  }

  try {
    // Check if company already exists
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // // Upload image to Cloudinary
    // console.log("Uploading to Cloudinary:", imageFile.path);
    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //     folder: 'company_logos', // Optional: organize in folders
    //     transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize
    // });

    // // Delete temp file after upload
    // fs.unlink(imageFile.path, (err) => {
    //     if (err) console.error("Error deleting temp file:", err);
    // });

    // Create company
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Clean up temp file if error occurs
    if (imageFile && imageFile.path) {
      fs.unlink(imageFile.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Company Login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
//   console.log("Email",email)
//   console.log("Password",password)

  try {
    const company = await Company.findOne({ email });

    if (bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },

        token:generateToken(company._id)

      });
    }

    else{
        res.json({success:false,message:"Invalid email or password"});
    }

  } catch (error) {

    res.json({success:false,message:error.message});

  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  // Add your logic here
};

// Post a new job
export const postJob = async (req, res) => {
  
  const {title,description,location,salary}=req.body;


};

// Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {
  // Add your logic here
};

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
  // Add your logic here
};

// Change Job Application Status
export const ChangeJobApplicationsStatus = async (req, res) => {
  // Add your logic here
};

// Change Job Visiblity
export const changeVisiblity = async (req, res) => {
  // Add your logic here
};
