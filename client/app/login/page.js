"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/context/authProvider";
import { useForm } from "react-hook-form";

const Login = () => {
  const { Login, userLoading, authError, setAuthSuccess } =
    useContext(AuthContext);
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm();
  const handleLogin = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    await Login(payload);
  };

  return (
    <div className="fullPage flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Please! Sign in
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {/* {error && (
              <p className="text-red-500 bg-gray-100 border px-3 rounded my-3">
                {error}
              </p>
            )} */}
            <div>
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
              <input
                id="email-address"
                name="email"
                {...register("email", { required: "Email is required." })}
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <p className="text-red-500 text-sm">
                {errors?.password?.message}
              </p>
              <input
                id="password"
                name="password"
                {...register("password", { required: "Password is required." })}
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don&apos;t have an account?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {userLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <p className="text-red-500 text-sm">{authError}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
