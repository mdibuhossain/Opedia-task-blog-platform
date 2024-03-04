"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/context/authProvider";

const AuthLinks = () => {
  const { user, userLoading, Logout } = useContext(AuthContext);
  if (userLoading === true) {
    return (
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
    );
  } else {
    if (user?.email) {
      return (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/blog/new">
            <button className="bg-orange-500 hover:bg-orange-400 text-white duration-100 hover:shadow-md rounded-full px-3 py-1 text-base">
              Write blog
            </button>
          </Link>
          <button
            onClick={Logout}
            className="bg-red-500 hover:bg-red-400 text-white duration-100 hover:shadow-md rounded-full px-3 py-1 text-base"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link href="/login">
            <button className="bg-blue-300 hover:bg-blue-200 duration-100 hover:shadow-md rounded-full px-3 py-1 text-base">
              Login
            </button>
          </Link>
        </>
      );
    }
  }
};

export default AuthLinks;
