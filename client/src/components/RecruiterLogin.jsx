import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);

  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  //   const onSubmitHandler = async (e) => {
  //   e.preventDefault();

  //    // Debug: Log the values before anything else
  //   console.log("Email:", email);
  //   console.log("Password:", password);
  //   console.log("State:", state);
  //   console.log("isTextDataSubmited:", isTextDataSubmited);

  //   if (state === "Sign Up" && !isTextDataSubmited) {
  //     setIsTextDataSubmited(true);
  //     return; // Important: Stop execution here for the next step
  //   }

  //   try {
  //     if (state === "Login") {
  //       // Validate inputs before making the request
  //       if (!email || !password) {
  //         toast.error("Please enter both email and password");
  //         return;
  //       }

  //       const { data } = await axios.post(backendUrl + '/api/company/login', {
  //         email,
  //         password
  //       });

  //       if (data.success) {
  //         console.log(data);
  //         setCompanyData(data.company);
  //         setCompanyToken(data.token);
  //         localStorage.setItem('companyToken', data.token);
  //         setShowRecruiterLogin(false);
  //         navigate('/dashboard');
  //         toast.success("Login successful!");
  //       } else {
  //         // This handles incorrect password case
  //         toast.error(data.message || "Login failed. Please try again.");
  //       }
  //     }

  //     if (state === "Sign Up" && isTextDataSubmited) {
  //       // Your signup logic here
  //       if (!name || !email || !password) {
  //         toast.error("Please fill all fields");
  //         return;
  //       }

  //       const formData = new FormData();
  //       formData.append('name', name);
  //       formData.append('email', email);
  //       formData.append('password', password);
  //       if (image) {
  //         formData.append('image', image);
  //       }

  //       const { data } = await axios.post(backendUrl + '/api/company/register', formData);

  //       if (data.success) {
  //         toast.success("Account created successfully! Please login.");
  //         setState("Login");
  //         setIsTextDataSubmited(false);
  //         // Clear form
  //         setName("");
  //         setEmail("");
  //         setPassword("");
  //         setImage(false);
  //       } else {
  //         toast.error(data.message || "Registration failed");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);

  //     // Enhanced error handling for the login/signup process
  //     if (error.response) {
  //       // Server responded with an error status
  //       const errorMessage = error.response.data?.message ||
  //                           error.response.data?.error ||
  //                           `Server error: ${error.response.status}`;
  //       toast.error(errorMessage);

  //       // Specific handling for wrong password
  //       if (error.response.status === 401) {
  //         toast.error("Invalid email or password");
  //       }
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       toast.error("Network error. Please check your connection.");
  //     } else {
  //       // Something else went wrong
  //       toast.error(error.message || "An unexpected error occurred");
  //     }
  //   }
  // };

  // new
  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();

  //   console.log("1. Form submitted");
  //   console.log("Email:", email);
  //   console.log("Password:", password);
  //   console.log("State:", state);
  //   console.log("isTextDataSubmited:", isTextDataSubmited);

  //   try {
  //     console.log("2. Entered try block");

  //     if (state === "Sign Up" && !isTextDataSubmited) {
  //       console.log("3. Sign up first step");
  //       setIsTextDataSubmited(true);
  //       return;
  //     }

  //     console.log("4. Checking login condition");

  //     if (state === "Login") {
  //       console.log("5. Inside login block");

  //       // Validate inputs
  //       if (!email || !password) {
  //         console.log("6. Validation failed");
  //         toast.error("Please enter both email and password");
  //         return;
  //       }

  //       console.log("7. About to make API call to:", backendUrl + '/api/company/login');
  //       console.log("8. Request data:", { email, password: "***" });

  //       const response = await axios.post(backendUrl + '/api/company/login', {
  //         email,
  //         password
  //       });

  //       console.log("9. API response received:", response);
  //       console.log("10. Response data:", response.data);

  //       const { data } = response;
  //       console.log("11. Data destructured:", data);

  //       if (data.success) {
  //         console.log("12. Login successful");
  //         setCompanyData(data.company);
  //         setCompanyToken(data.token);
  //         localStorage.setItem('companyToken', data.token);
  //         setShowRecruiterLogin(false);
  //         navigate('/dashboard');
  //         toast.success("Login successful!");
  //       } else {
  //         console.log("13. Login failed - server returned success: false");
  //         toast.error(data.message || "Login failed. Please try again.");
  //       }
  //     }else {
  //     const formData = new FormData();
  //     formData.append('name', name);
  //     formData.append('password', password);
  //     formData.append('email', email);

  //     // Check if image exists and is a File object
  //     if (image && image instanceof File) {
  //         formData.append('image', image);
  //     }

  //     try {
  //         const { data } = await axios.post(backendUrl + '/api/company/register', formData, {
  //             headers: {
  //                 'Content-Type': 'multipart/form-data'
  //             }
  //         });

  //         if (data.success) {
  //             setCompanyData(data.company);
  //             setCompanyToken(data.token);
  //             localStorage.setItem('companyToken', data.token);
  //             setShowRecruiterLogin(false);
  //             navigate('/dashboard');
  //             toast.success("Registration successful!");
  //         } else {
  //             toast.error(data.message);
  //         }
  //     } catch (error) {
  //         console.error("Registration error:", error);
  //         if (error.response) {
  //             toast.error(error.response.data?.message || "Registration failed");
  //         } else {
  //             toast.error("Network error. Please try again.");
  //         }
  //     }
  // }

  //     console.log("14. End of try block");

  //   } catch (error) {
  //     console.log("15. Entered catch block");
  //     console.error("16. Full error object:", error);
  //     console.error("17. Error message:", error.message);
  //     console.error("18. Error stack:", error.stack);

  //     if (error.response) {
  //       console.log("19. Error has response:", error.response);
  //       const errorMessage = error.response.data?.message ||
  //                           error.response.data?.error ||
  //                           `Server error: ${error.response.status}`;
  //       toast.error(errorMessage);
  //     } else if (error.request) {
  //       console.log("20. Error has request but no response");
  //       toast.error("Network error. Please check your connection.");
  //     } else {
  //       console.log("21. Generic error");
  //       toast.error(error.message || "An unexpected error occurred");
  //     }
  //   }

  //   console.log("22. onSubmitHandler completed");
  // };

  // Updated onSubmitHandler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log("1. Form submitted");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("State:", state);
    console.log("isTextDataSubmited:", isTextDataSubmited);

    try {
      console.log("2. Entered try block");

      // Handle Sign Up first step (show image upload)
      if (state === "Sign Up" && !isTextDataSubmited) {
        console.log("3. Sign up first step - showing image upload");
        setIsTextDataSubmited(true);
        return;
      }

      console.log("4. Checking conditions for Login/Sign Up");

      // Handle Login
      if (state === "Login") {
        console.log("5. Inside login block");

        if (!email || !password) {
          console.log("6. Validation failed");
          toast.error("Please enter both email and password");
          return;
        }

        console.log("7. About to make login API call");
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });

        if (data.success) {
          console.log("8. Login successful");
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
          toast.success("Login successful!");
        } else {
          console.log("9. Login failed");
          toast.error(data.message || "Login failed. Please try again.");
        }
      }

      // Handle Sign Up second step (submit form with image)
      else if (state === "Sign Up" && isTextDataSubmited) {
        console.log("10. Inside signup block - submitting registration");

        if (!name || !email || !password) {
          console.log("11. Signup validation failed");
          toast.error("Please fill all fields");
          return;
        }

        console.log("12. Creating FormData for signup");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);

        if (image && image instanceof File) {
          console.log("13. Appending image to FormData");
          formData.append("image", image);
        } else {
          console.log("13. No image provided");
        }

        console.log(
          "14. Making signup API call to:",
          backendUrl + "/api/company/register",
        );
        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (data.success) {
          console.log("15. Signup successful");
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
          toast.success("Account created successfully!");
        } else {
          console.log("16. Signup failed", data); // Add this to see the error
          console.log("Error message:", data.message); // Log the specific message
          toast.error(data.message || "Registration failed");
        }
      }

      console.log("17. End of try block");
    } catch (error) {
      console.log("18. Entered catch block");
      console.error("Error:", error);

      if (error.response) {
        console.log("19. Error has response");
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        console.log("20. Error has request but no response");
        toast.error("Network error. Please check your connection.");
      } else {
        console.log("21. Generic error");
        toast.error(error.message || "An unexpected error occurred");
      }
    }

    console.log("22. onSubmitHandler completed");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state === "Sign Up" && isTextDataSubmited ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full cursor-pointer"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
              <p>
                Upload Company
                <br />
                Logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot Password ?
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white  py-2 w-full rounded-full mt-6"
        >
          {state === "Login"
            ? "login"
            : isTextDataSubmited
              ? "create account"
              : "next"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
