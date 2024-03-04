"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/context/authProvider";
import { useForm } from "react-hook-form";

const Signup = () => {
  const { Signup, userLoading, authSuccess, setAuthSuccess } =
    useContext(AuthContext);
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm();
  React.useEffect(() => {
    setAuthSuccess("");
  }, []);
  const handleSignup = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    };
    if (payload.password === payload.password_confirmation) {
      clearErrors("password_confirmation");
      await Signup(payload);
    } else {
      setError("password_confirmation", {
        type: "custom",
        message: "Password did not matched",
      });
    }
  };
  return (
    <div className="fullPage flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Please! Sign up
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleSignup)} className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {/* {error && (
              <p className="text-red-500 bg-gray-100 border px-3 rounded my-3">
                {error}
              </p>
            )} */}
            <div>
              <p className="text-red-500 text-sm">{errors?.name?.message}</p>
              <input
                id="name"
                name="name"
                {...register("name", { required: "Name is required." })}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
              <input
                id="email"
                name="email"
                {...register("email", { required: "Email is required." })}
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter Email address"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <p className="text-red-500 text-sm">
                {errors?.password_confirmation?.message}
              </p>
              <input
                id="password_confirmation"
                name="password_confirmation"
                {...register("password_confirmation", {
                  required: "Confirmation password is required.",
                })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Already have an account?
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
                "Sign up"
              )}
            </button>
          </div>
          {authSuccess.length > 0 && (
            <div className="flex items-center gap-2">
              <p className="text-green-600 text-sm">{authSuccess}</p>
              <div className="text-sm">
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Goto Login
                </Link>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
