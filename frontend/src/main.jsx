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

const ProtectedRoute = ({ element, redirectTo }) => {
  const { user } = useAuth();
  return user ? <Navigate to={redirectTo} /> : element;
};

const AuthenticatedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
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
                <ProtectedRoute element={<Login />} redirectTo="/posts" />
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute element={<Register />} redirectTo="/posts" />
              }
            />
            <Route
              path="/posts"
              element={<AuthenticatedRoute element={<PostPage />} />}
            />
            <Route
              path="/user"
              element={<AuthenticatedRoute element={<UserPage />} />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
