// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth, useUser } from "@clerk/react";
// // import { useUser, useAuth } from '@clerk/clerk-react';

// export const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   // const { user } = useUser();
//   // const { getToken } = useAuth();

//   const [searchFilter, setSearchFilter] = useState({
//     title: "",
//     location: "",
//   });

//   const [isSearched, setIsSearched] = useState(false);

//   const [jobs, setJobs] = useState([]);

//   const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

//   const [companyToken, setCompanyToken] = useState(null);
//   const [companyData, setCompanyData] = useState(null);

//   const [userData, setUserData] = useState(null);
//   const [userApplications, setUserApplications] = useState([]);

//   const { user, isSignedIn, isLoaded } = useUser();
//   const { getToken } = useAuth();
//   // const [userData, setUserData] = useState(null);

//   // Function to fetch jobs data
//   const fetchJobs = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/jobs");

//       if (data.success) {
//         setJobs(data.jobs);
//         console.log(data.jobs);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   //Function to fetch company data
//   const fetchCompanyData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/company/company", {
//         headers: { token: companyToken },
//       });

//       if (data.success) {
//         setCompanyData(data.company);
//         // console.log(data);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   //Function to fetch User Data
//   // const fetchUserData = async()=>{
//   //     try {

//   //         const token = await getToken();

//   //         const {data} = await axios.get(backendUrl+'/api/users/user',
//   //             {headers:{Authorization:`Bearer ${token}`}})

//   //             if(data.success){
//   //                 setUserData(data.user);
//   //             }else{
//   //                 toast.error(data.message);
//   //             }

//   //     } catch (error) {
//   //         toast.error(error.message);
//   //     }
//   // }
// const fetchUserData = async () => {
//     // console.log("=== FETCH USER DATA ===");
//     // console.log("isLoaded:", isLoaded);
//     // console.log("isSignedIn:", isSignedIn);
//     // console.log("user exists:", !!user);
    
//     if (!isLoaded) {
//       // console.log("⏳ Clerk not loaded yet");
//       return;
//     }
    
//     if (!isSignedIn) {
//       // console.log("❌ User not signed in");
//       return;
//     }
    
//     try {
//       // Get the token
//       const token = await getToken();
//       // console.log("Token obtained:", token ? "✅ Yes" : "❌ No");
//       // console.log("Token preview:", token?.substring(0, 20) + "...");
      
//       if (!token) {
//         // toast.error("No authentication token available");
//         return;
//       }
      
//       const backendUrl = import.meta.env.VITE_BACKEND_URL;
//       // console.log("Backend URL:", backendUrl);
//       // console.log("Making request to:", `${backendUrl}/api/users/user`);
      
//       const response = await axios.get(`${backendUrl}/api/users/user`, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       // console.log("Response status:", response.status);
//       // console.log("Response data:", response.data);
      
//       if (response.data.success) {
//         setUserData(response.data.user);
//         console.log("✅ User data set successfully");
//       } else {
//         console.log("❌ API returned error:", response.data.message);
//         toast.error(response.data.message);
//       }
      
//     } catch (error) {
//       // console.error("=== ERROR IN FETCH ===");
//       // console.error("Error name:", error.name);
//       // console.error("Error message:", error.message);
      
//       if (error.response) {
//         // console.error("Response status:", error.response.status);
//         // console.error("Response data:", error.response.data);
//         // console.error("Response headers:", error.response.headers);
        
//         if (error.response.status === 401) {
//           toast.error("Authentication failed. Please login again.");
//           // Clear any old tokens
//           localStorage.removeItem("userToken");
//           localStorage.removeItem("token");
//         } else {
//           toast.error(error.response.data?.message || "Failed to fetch user data");
//         }
//       } else if (error.request) {
//         // console.error("No response received from server");
//         toast.error("Cannot connect to server");
//       } else {
//         console.error("Error:", error.message);
//         toast.error(error.message);
//       }
//     }
//   };

//   //Function to fetch user's applied applications data
//   const fetchUserApplications = async()=>{
//     try {
      
//       const token = await getToken();

//       const {data} = await axios.get(backendUrl+'/api/users/applications',
//         {headers:{Authorization:`Bearer ${token}`}}
//       )
//       if(data.success){
//         setUserApplications(data.applications);
//       }else{
//         toast.error(data.message);
//       }

//     } catch (error) {
//       toast.error(error.message);
//     }
//   }

//   useEffect(() => {
//     fetchJobs();

//     const storedCompanyToken = localStorage.getItem("companyToken");

//     if (storedCompanyToken) {
//       setCompanyToken(storedCompanyToken);
//     }
//   }, []);

//   useEffect(() => {
//     if (companyToken) {
//       fetchCompanyData();
//     }
//   }, [companyToken]);

//   useEffect(() => {
//     if (user) {
//       fetchUserData();
//       fetchUserApplications();
//     }
//   },[user]);

//   const value = {
//     searchFilter,
//     setSearchFilter,
//     isSearched,
//     setIsSearched,
//     jobs,
//     setJobs,
//     showRecruiterLogin,
//     setShowRecruiterLogin,
//     companyToken,
//     setCompanyToken,
//     companyData,
//     setCompanyData,
//     backendUrl,
//     userData,
//     setUserData,
//     userApplications,
//     setUserApplications,
//     fetchUserData,
//     fetchUserApplications
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };


//New AppContext.jsx 
import { createContext, useEffect, useState } from "react";
import api from "../utils/api"; // ✅ Import api instead of axios
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]); // ✅ Fixed spelling

  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Function to fetch jobs data
  const fetchJobs = async () => {
    try {
      console.log('📡 Fetching jobs from:', `${backendUrl}/api/jobs`);
      const { data } = await api.get('/api/jobs'); // ✅ Using api instead of axios

      if (data.success) {
        setJobs(data.jobs);
        console.log('✅ Jobs fetched:', data.jobs.length);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('❌ Fetch jobs error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await api.get('/api/company/company', {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to fetch User Data
  const fetchUserData = async () => {
    console.log("=== FETCH USER DATA ===");
    console.log("isLoaded:", isLoaded);
    console.log("isSignedIn:", isSignedIn);
    
    if (!isLoaded) {
      console.log("⏳ Clerk not loaded yet");
      return;
    }
    
    if (!isSignedIn) {
      console.log("❌ User not signed in");
      return;
    }
    
    try {
      const token = await getToken();
      console.log("Token obtained:", token ? "✅ Yes" : "❌ No");
      
      if (!token) {
        toast.error("No authentication token available");
        return;
      }
      
      console.log("Making request to:", `${backendUrl}/api/users/user`);
      
      const response = await api.get('/api/users/user', {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Response status:", response.status);
      
      if (response.data.success) {
        setUserData(response.data.user);
        console.log("✅ User data set successfully");
      } else {
        console.log("❌ API returned error:", response.data.message);
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.error("=== ERROR IN FETCH ===");
      console.error("Error message:", error.message);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        
        if (error.response.status === 401) {
          toast.error("Authentication failed. Please login again.");
          localStorage.removeItem("userToken");
          localStorage.removeItem("token");
        } else {
          toast.error(error.response.data?.message || "Failed to fetch user data");
        }
      } else if (error.request) {
        console.error("No response received from server");
        toast.error("Cannot connect to server");
      } else {
        toast.error(error.message);
      }
    }
  };

  // Function to fetch user's applied applications data
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.log("❌ No token available for fetching applications");
        return;
      }

      const { data } = await api.get('/api/users/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setUserApplications(data.applications);
        console.log('✅ Applications fetched:', data.applications.length);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('❌ Fetch applications error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (user && isLoaded) {
      console.log("👤 User changed, fetching user data...");
      fetchUserData();
      fetchUserApplications();
    }
  }, [user, isLoaded]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications, // ✅ Fixed spelling
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
    fetchJobs // ✅ Added this for components to use
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};