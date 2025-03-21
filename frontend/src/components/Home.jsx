import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/posts");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center font-poppins">
      {/* Left Column with Image and Tagline */}
      <div className="hidden lg:w-1/2 bg-gradient-to-br from-indigo-700 to-indigo-900 lg:flex lg:flex-col justify-center items-center relative">
        <img src="/doggo.svg" alt="doggo" className="h-96 z-0" />
        <p className="font-semibold text-white text-center max-w-xs z-10 mt-4 p-4 shadow-lg rounded-md bg-indigo-700 bg-opacity-50">
          Secure, no-nonsense, and simple notes app for your daily use.
        </p>
      </div>

      {/* Right Column with Login Form */}
      <div className="lg:w-1/2 lg:flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
