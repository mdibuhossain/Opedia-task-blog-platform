"use client";

import React, { createContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const AllContext = useAuth();
  return (
    <AuthContext.Provider value={AllContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
