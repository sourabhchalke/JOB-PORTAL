import React, { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";

import Navbar from "../components/Navbar";

import kconvert from 'k-convert';

import moment from 'moment';

import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/react";

const ApplyJob = () => {
  const { id } = useParams();

  const {getToken} = useAuth();

  const navigate = useNavigate();

  const [JobData, setJobData] = useState(null);

  const { jobs,backendUrl,userData,userApplicatins } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      
      const {data} = await axios.get(backendUrl+`/api/jobs/${id}`);

    if(data.success){
      setJobData(data.job);
    }else{
      toast.error(data.message);
    }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // const applyHandler = async()=>{
  //   try {
      
  //     if(!userData){
  //       return toast.error('Login to apply for jobs');
  //     }

  //     if(!userData.resume){
  //       navigate('/applications');
  //       return toast.error('Upload resume to apply');
  //     }

  //     const token = await getToken();

  //     const {data} = await axios.post(backendUrl+'/api/users/apply',
  //       {jobId:JobData._id},
  //       {headers:{Authorization:`Bearer ${token}`}}
  //     )

  //     if(data.success){
  //       toast.success(data.message);
  //     }else{
  //       toast.error(data.message);
  //     }

  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // }
  //New applyHandler Debuuging
  // Frontend - Add logging
// ApplyJob.jsx
const applyHandler = async () => {
    try {
        if (!userData) {
            return toast.error('Login to apply for jobs');
        }

        if (!userData.resume) {
            navigate('/applications');
            return toast.error('Upload resume to apply');
        }

        const token = await getToken();
        
        console.log('📤 Applying for job with ID:', JobData._id);
        console.log('📤 Full JobData:', JobData);

        const { data } = await axios.post(
            backendUrl + '/api/users/apply',
            { jobId: JobData._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
            toast.success(data.message);
            // Optionally refresh to show applied status
            // window.location.reload();
        } else {
            // ✅ Show the message from backend (will be "Already Applied")
            toast.error(data.message);
        }

    } catch (error) {
        console.error('Apply error:', error);
        
        // ✅ Check if the error is because user already applied
        if (error.response?.data?.message === 'You have already applied for this job') {
            toast.info('You have already applied for this job');
        } else if (error.response?.data?.message === 'You have already applied for this job') {
            toast.info('You already applied to this position');
        } else {
            toast.error(error.response?.data?.message || error.message);
        }
    }
};

  useEffect(() => {
      fetchJob();
  }, [id]);

  return JobData ? (
    <>
      <Navbar />
      <div className="container min-h-screen flex flex-col py-10 px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border" src={JobData.companyId.image} alt="" />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{JobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId.name}   
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC : {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button onClick={applyHandler} className="bg-blue-600 px-10 py-3 rounded text-white">Apply Now</button>
              <p className="mt-1 text-gray-600 mx-auto">Posted {moment(JobData.date).fromNow()}</p>
            </div>

          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{__html:JobData.description}}></div>
              <button onClick={applyHandler} className="bg-blue-600 px-10 py-3 rounded text-white mt-10">Apply Now</button>
            </div>
            {/* Right Section More Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More Jobs From {JobData.companyId.name}</h2>
              {jobs.filter(job=>job._id !== JobData._id && job.companyId._id === JobData.companyId._id).filter(job => true).slice(0,4).map((job,index)=><JobCard key={index} job={job}/>)}
            </div>
          </div>

        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;


// New Code
// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import Loading from "../components/Loading";
// import Navbar from "../components/Navbar";
// import kconvert from 'k-convert';
// import moment from 'moment';
// import JobCard from '../components/JobCard';
// import Footer from '../components/Footer';
// import axios from "axios";
// import { toast } from "react-toastify";

// const ApplyJob = () => {
//   const { id } = useParams();
//   const [JobData, setJobData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { jobs, backendUrl } = useContext(AppContext);

//   const fetchJob = async () => {
//     console.log("=== FETCH JOB STARTED ===");
//     console.log("1. ID from URL:", id);
//     console.log("2. Backend URL:", backendUrl);
//     console.log("3. Full API URL:", `${backendUrl}/api/jobs/${id}`);
    
//     // Clean the ID if needed
//     const cleanId = id ? id.replace(/[:]/g, '') : '';
//     console.log("4. Cleaned ID:", cleanId);
    
//     if (!cleanId) {
//       console.error("5. ERROR: No valid ID provided");
//       setError("Invalid job ID");
//       setLoading(false);
//       toast.error("Invalid job ID");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log("6. Making API request to:", `${backendUrl}/api/jobs/${cleanId}`);
//       console.log("7. Request timestamp:", new Date().toISOString());
      
//       const { data } = await axios.get(`${backendUrl}/api/jobs/${cleanId}`, {
//         timeout: 10000, // 10 second timeout
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       console.log("8. API Response received:", new Date().toISOString());
//       console.log("9. Response status:", data);
//       console.log("10. Response data structure:", {
//         hasSuccess: data?.success !== undefined,
//         successValue: data?.success,
//         hasJob: data?.job !== undefined,
//         jobData: data?.job,
//         hasMessage: data?.message !== undefined,
//         message: data?.message
//       });

//       if (data.success) {
//         console.log("11. SUCCESS: Job data received");
//         console.log("12. Job details:", {
//           id: data.job?._id,
//           title: data.job?.title,
//           company: data.job?.companyId?.name,
//           location: data.job?.location
//         });
//         setJobData(data.job);
//       } else {
//         console.error("13. ERROR: API returned success: false");
//         console.error("14. Error message:", data.message);
//         setError(data.message || "Failed to fetch job details");
//         toast.error(data.message || "Failed to fetch job details");
//       }
//     } catch (error) {
//       console.error("=== ERROR IN FETCH JOB ===");
//       console.error("15. Error type:", error.name);
//       console.error("16. Error message:", error.message);
      
//       if (error.code === 'ECONNABORTED') {
//         console.error("17. Request timeout - server not responding");
//         setError("Request timeout. Server might be down.");
//         toast.error("Server is not responding. Please try again.");
//       } else if (error.response) {
//         // The request was made and the server responded with a status code
//         console.error("18. Response error - Status:", error.response.status);
//         console.error("19. Response error - Data:", error.response.data);
//         console.error("20. Response error - Headers:", error.response.headers);
//         setError(`Server error: ${error.response.status} - ${error.response.data?.message || error.message}`);
//         toast.error(error.response.data?.message || `Server error: ${error.response.status}`);
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error("21. No response received - Request:", error.request);
//         console.error("22. Check if backend is running on port 5000");
//         setError("Cannot connect to server. Backend might not be running.");
//         toast.error("Cannot connect to server. Please check if backend is running.");
//       } else {
//         // Something happened in setting up the request
//         console.error("23. Request setup error:", error.message);
//         setError(error.message);
//         toast.error(error.message || "Failed to load job details");
//       }
//     } finally {
//       console.log("24. Setting loading to false");
//       setLoading(false);
//       console.log("=== FETCH JOB COMPLETED ===");
//     }
//   };

//   useEffect(() => {
//     console.log("=== USE EFFECT TRIGGERED ===");
//     console.log("ID:", id);
//     console.log("Jobs from context:", jobs?.length || 0, "jobs");
    
//     if (id) {
//       console.log("ID exists, calling fetchJob");
//       fetchJob();
//     } else {
//       console.warn("No ID provided in URL");
//       setLoading(false);
//       setError("No job ID provided");
//     }
//   }, [id]);

//   // Debug logging for state changes
//   useEffect(() => {
//     console.log("STATE UPDATE - loading:", loading, "has JobData:", !!JobData, "error:", error);
//   }, [loading, JobData, error]);

//   // Show loading while fetching
//   if (loading) {
//     console.log("Rendering: Loading component");
//     return <Loading />;
//   }

//   // Show error message if error exists
//   if (error) {
//     console.log("Rendering: Error state", error);
//     return (
//       <>
//         <Navbar />
//         <div className="container min-h-screen flex flex-col items-center justify-center py-10 px-4">
//           <div className="text-center max-w-md mx-auto bg-red-50 p-8 rounded-lg border border-red-200">
//             <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Job</h2>
//             <p className="text-gray-700 mb-4">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//             >
//               Retry
//             </button>
//             <button 
//               onClick={() => window.history.back()}
//               className="ml-3 text-blue-600 hover:underline"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Show error message if no job data
//   if (!JobData) {
//     console.log("Rendering: No job data found");
//     return (
//       <>
//         <Navbar />
//         <div className="container min-h-screen flex flex-col items-center justify-center py-10 px-4">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold text-gray-700 mb-4">Job Not Found</h2>
//             <p className="text-gray-500">The job you're looking for doesn't exist or has been removed.</p>
//             <button 
//               onClick={() => window.history.back()}
//               className="mt-4 text-blue-600 hover:underline"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   console.log("Rendering: Job data found", JobData.title);
//   return (
//     <>
//       <Navbar />
//       <div className="container min-h-screen flex flex-col py-10 px-4 2xl:px-20 mx-auto">
//         <div className="bg-white text-black rounded-lg w-full">
//           <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
//             <div className="flex flex-col md:flex-row items-center">
//               <img 
//                 className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border" 
//                 src={JobData.companyId?.image || assets.default_company_image} 
//                 alt="" 
//               />
//               <div className="text-center md:text-left text-neutral-700">
//                 <h1 className="text-2xl sm:text-4xl font-medium">{JobData.title}</h1>
//                 <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
//                   <span className="flex items-center gap-1">
//                     <img src={assets.suitcase_icon} alt="" />
//                     {JobData.companyId?.name || "Unknown Company"}   
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <img src={assets.location_icon} alt="" />
//                     {JobData.location}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <img src={assets.person_icon} alt="" />
//                     {JobData.level}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <img src={assets.money_icon} alt="" />
//                     CTC : {kconvert.convertTo(JobData.salary)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
//               <button className="bg-blue-600 px-10 py-3 rounded text-white hover:bg-blue-700 transition-colors">
//                 Apply Now
//               </button>
//               <p className="mt-1 text-gray-600 mx-auto">
//                 Posted {moment(JobData.date).fromNow()}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col lg:flex-row justify-between items-start">
//             <div className="w-full lg:w-2/3">
//               <h2 className="font-bold text-2xl mb-4">Job Description</h2>
//               <div className="rich-text" dangerouslySetInnerHTML={{__html: JobData.description}}></div>
//               <button className="bg-blue-600 px-10 py-3 rounded text-white mt-10 hover:bg-blue-700 transition-colors">
//                 Apply Now
//               </button>
//             </div>
            
//             {/* Right Section More Jobs */}
//             <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
//               <h2 className="font-semibold text-lg">More Jobs From {JobData.companyId?.name || "this company"}</h2>
//               {jobs && jobs.length > 0 ? (
//                 jobs
//                   .filter(job => job._id !== JobData._id && job.companyId?._id === JobData.companyId?._id)
//                   .slice(0, 4)
//                   .map((job, index) => <JobCard key={index} job={job} />)
//               ) : (
//                 <p className="text-gray-500">No other jobs available</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default ApplyJob;