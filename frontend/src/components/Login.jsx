export default function Login() {
  return (
    <div className="container mx-auto font-poppins">
      <div className="flex flex-col justify-center items-center max-w-md mx-auto py-8 px-10 lg:px-0">
        <h3 className="text-3xl font-semibold mb-6 text-zinc-800">Login</h3>
        <form action="" className="flex flex-col w-full">
          <div className="my-4 flex flex-col">
            <label className="text-sm text-zinc-600 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-zinc-300 rounded-md p-3 outline-none transition duration-200 focus:ring focus:ring-zinc-300"
              id="email"
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
              required
            />
          </div>

          <button className="bg-blue-600 text-white rounded-md p-2 my-4 cursor-pointer hover:bg-blue-700 transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
