export default function Login() {
  return (
    <div className="container mx-auto font-poppins">
      <div className="flex flex-col justify-center items-center lg:w-1/3 mx-auto mt-20 py-8 bg-zinc-50 rounded-sm border border-zinc-200">
        <h3 className="text-2xl font-semibold">Register</h3>
        <form action="" className="flex flex-col">
          <input
            type="text"
            placeholder="Name"
            className="border border-zinc-200 rounded-sm p-2 my-2 outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-zinc-200 rounded-sm p-2 my-2 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-zinc-200 rounded-sm p-2 my-2 outline-none"
            required
          />
          <button className="bg-zinc-600 text-white rounded-sm p-2 my-2 cursor-pointer hover:bg-zinc-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
