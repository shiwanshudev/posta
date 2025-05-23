import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ name, email, password });
      navigate("/posts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto font-poppins">
      <div className="flex flex-col justify-center items-center max-w-md mx-auto py-8 px-10 lg:px-0">
        <h3 className="text-3xl font-semibold mb-6 text-zinc-800">Register</h3>
        {error && <p className="text-red-500 mb-4">{error.toString()}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <div className="my-4 flex flex-col">
            <label className="text-sm text-zinc-600 mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="border border-zinc-300 rounded-md p-3 outline-none transition duration-200 focus:ring focus:ring-zinc-300"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="my-4 flex flex-col">
            <label className="text-sm text-zinc-600 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-zinc-300 rounded-md p-3 outline-none transition duration-200 focus:ring focus:ring-zinc-300"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="my-4 flex flex-col">
            <label className="text-sm text-zinc-600 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              id="password"
              className="border border-zinc-300 rounded-md p-3 outline-none transition duration-200 focus:ring focus:ring-zinc-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white rounded-md p-2 my-4 cursor-pointer hover:bg-indigo-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
