import { NavLink, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 shadow-md font-poppins px-5 lg:px-0">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-black text-2xl text-white hover:text-zinc-300 transition duration-300"
        >
          Posta
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          {user ? (
            <>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `text-white hover:text-zinc-300 transition duration-300 ${
                    isActive ? "font-semibold border-b-2 border-white" : ""
                  }`
                }
              >
                Posts
              </NavLink>
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `text-white hover:text-zinc-300 transition duration-300 ${
                    isActive ? "font-semibold border-b-2 border-white" : ""
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                className="text-white hover:text-zinc-300 transition duration-300"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-white hover:text-zinc-300 transition duration-300 ${
                    isActive ? "font-semibold border-b-2 border-white" : ""
                  }`
                }
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-white hover:text-zinc-300 transition duration-300 ${
                    isActive ? "font-semibold border-b-2 border-white" : ""
                  }`
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
