"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (username, password) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await res.json();
      setUser(data.user);
      router.push("/");

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, error, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
