import React, { useContext } from "react";
import { assets } from "../assets/assets";

import { useClerk, UserButton, useUser } from "@clerk/react";
import {Link, useNavigate} from 'react-router-dom';
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navigate = useNavigate();

  const {setShowRecruiterLogin}=useContext(AppContext);

  return (
    <div className="shadow py-3">
      <div className="container flex justify-between items-center px-3 2xl:px-20 mx-auto">
        <img onClick={()=>navigate('/')} className="cursor-pointer h-18" src={assets.logo} alt="" />
        {user ? (
          <div className="flex gap-3 items-center">
            <Link to={'/applications'}>Applied Jobs</Link>
            <p></p>
            <p className="max-sm:hidden">Hii,{user.firstName+" "+user.lastName}</p>
            <UserButton/>
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button onClick={()=> setShowRecruiterLogin(true)} className="text-gray-600 cursor-pointer">Recruiter Login</button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 py-2 sm:px-9 rounded-full cursor-pointer"
            >
              Login
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Navbar;
