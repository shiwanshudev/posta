import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import PostPage from "./pages/PostPage.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import UserPage from "./components/UserPage.jsx";
import { FaSpinner } from "react-icons/fa";

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  return user ? children : <Navigate to={redirectTo} replace />;
};

const PublicRoute = ({ children, redirectTo = "/posts" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  return !user ? children : <Navigate to={redirectTo} replace />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
