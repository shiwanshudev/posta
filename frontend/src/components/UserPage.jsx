import { useAuth } from "../contexts/AuthContext";

export default function UserPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto text-center py-10">
        <h2 className="text-2xl font-semibold text-zinc-800">
          Please log in to view your profile.
        </h2>
      </div>
    );
  }

  // Generate a random avatar URL using DiceBear
  const avatarUrl = `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
    user.email || user.name
  )}`;

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6 text-zinc-800">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        {/* Avatar */}
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        {/* User Details */}
        <p className="text-lg">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-lg">
          <strong>Joined:</strong>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
