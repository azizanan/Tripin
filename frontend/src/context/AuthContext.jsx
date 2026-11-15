import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("tripin_token");
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("tripin_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data.data);
      return response.data.data;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { token, user: loggedInUser } = response.data.data;
    localStorage.setItem("tripin_token", token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const { token, user: registeredUser } = response.data.data;
    localStorage.setItem("tripin_token", token);
    setUser(registeredUser);
    return registeredUser;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshProfile }),
    [user, loading, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  return context;
}
