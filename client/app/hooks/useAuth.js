"use client";

import { useRouter } from "next/navigation";
import React from "react";

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({});
  const [authError, setAuthError] = React.useState("");
  const [authSuccess, setAuthSuccess] = React.useState("");
  const [userLoading, setUserLoading] = React.useState(true);

  const Signup = async (payload) => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/auth/register`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    if (data.ok) {
      setAuthError("");
      setAuthSuccess((await data.json()).message);
    } else {
      const errorMessage = (await data.json()).message;
      console.log(errorMessage);
      setAuthError(errorMessage);
    }
  };

  const Login = async (payload) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (data.ok) {
      await checkProfile();
      router.push("/");
    } else {
      const errorMessage = (await data.json()).message;
      console.log(errorMessage);
      setAuthError(errorMessage);
    }
  };

  const Logout = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/auth/logout`, {
      credentials: "include",
    });
    if (data.ok) {
      setUser({});
    }
  };

  const checkProfile = async () => {
    setUserLoading(true);
    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/profile`, {
      method: "get",
      credentials: "include",
    });
    if (data.ok) {
      setAuthError("");
      const userData = await data.json();
      setUser(userData);
    }
    setUserLoading(false);
  };

  React.useEffect(() => {
    checkProfile();
  }, []);
  return {
    user,
    Login,
    Logout,
    Signup,
    authError,
    userLoading,
    authSuccess,
    setAuthSuccess,
  };
};

export default useAuth;
