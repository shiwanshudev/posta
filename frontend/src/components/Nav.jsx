import { NavLink, Link } from "react-router";

export default function Nav() {
  return (
    <nav className="py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 shadow-md font-poppins">
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
        </div>
      </div>
    </nav>
  );
}
