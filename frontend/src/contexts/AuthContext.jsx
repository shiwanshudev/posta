import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URI}/api/users/verify`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Token verification failed");
          }
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } catch (error) {
          console.error("Token verification error:", error);
          setError(error.message);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (userData) => {
    const { email, password } = userData;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/posts");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const { name, email, password } = userData;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Registration failed. Please check your details.");
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/posts");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
