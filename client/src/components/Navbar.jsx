import React from "react";
import { assets } from "../assets/assets";

import { useClerk, UserButton, useUser } from "@clerk/react";
import {Link} from 'react-router-dom';

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className="shadow py-3">
      <div className="container flex justify-between items-center px-3 2xl:px-20 mx-auto">
        <img src={assets.logo} width={50} alt="" />
        {user ? (
          <div className="flex gap-3 items-center">
            <Link to={'/applications'}>Applied Jobs</Link>
            <p></p>
            <p>Hii,{user.firstName+" "+user.lastName}</p>
            <UserButton/>
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button className="text-gray-600 ">Recruiter Login</button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 py-2 sm:px-9 rounded-full"
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
