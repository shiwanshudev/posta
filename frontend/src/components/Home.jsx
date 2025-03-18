import Login from "./Login";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center font-poppins">
      {/* Left Column with Image and Tagline */}
      <div className="hidden lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 lg:flex lg:flex-col justify-center items-center relative">
        <img src="/doggo.svg" alt="doggo" className="h-96 z-0" />
        <p className="font-semibold text-white text-center max-w-xs z-10 mt-4 p-4 shadow-lg rounded-md bg-blue-700 bg-opacity-50">
          Secure, no-nonsense, and simple posts for your daily use.
        </p>
      </div>

      {/* Right Column with Login Form */}
      <div className="lg:w-1/2 lg:flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
