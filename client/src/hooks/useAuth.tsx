import {createContext, useContext, useState, useEffect } from "react";
import React from "react";
import axios from "axios";

interface User {
  email: string;
}

interface AuthCtx {
  user?: User;
  loading: boolean;
  login(email: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
  register(_email: string, _password: string): Promise<boolean>;
}

const AuthContext = createContext<AuthCtx>({
  user: undefined,
  loading: true,
  async login() {
    return false;
  },
  async logout() {},
  async register() {
    return false;
  }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<User>("/api/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => setUser(undefined))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    try {
      await axios.post("/api/auth/login", { email, password });
      setUser({ email });
      return true;
    } catch {
      return false;
    }
  }

  async function logout() {
    await axios.post("/api/auth/logout");
    setUser(undefined);
  }

  async function register(email: string, password: string) {
    try {
      await axios.post("/api/auth/register", { email, password });
      return true;
    } catch {
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
